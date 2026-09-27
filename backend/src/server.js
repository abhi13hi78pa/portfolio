import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB, isDbConnected } from './config/db.js';
import { syncAdminCredentials } from './controllers/authController.js';
import './models/index.js'; // Ensure models are registered with Sequelize

import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import codingProfileRoutes from './routes/codingProfileRoutes.js';
import socialLinkRoutes from './routes/socialLinkRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { globalLimiter, apiMutationLimiter } from './middleware/rateLimiter.js';

dotenv.config();

// Validate critical environment variables
const requiredEnv = ['JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

// Warn if FRONTEND_URL not set in production
if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
  console.warn('⚠️ FRONTEND_URL not set; CORS will only allow localhost origins.');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration - defined before helmet to satisfy connectSrc CSP
const rawFrontendUrls = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((u) => u.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  ...rawFrontendUrls,
];

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", ...rawFrontendUrls],
      frameAncestors: ["'none'"],
    },
  },
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.includes(normalized) ||
      (process.env.NODE_ENV !== 'production' && allowedOrigins.length === 0);
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

// Rate limiting
app.use(globalLimiter);
app.use('/api', apiMutationLimiter);

// Cookie parser for HttpOnly refresh tokens
app.use(cookieParser());

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const response = {
    status: isDbConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
  };
  if (!isProd) {
    response.database = isDbConnected ? 'connected' : 'disconnected';
  }
  res.json(response);
});

// API Routes - mounted under /api/*
const apiEndpoints = [
  ['/auth', authRoutes],
  ['/profile', profileRoutes],
  ['/skills', skillRoutes],
  ['/projects', projectRoutes],
  ['/experience', experienceRoutes],
  ['/education', educationRoutes],
  ['/certifications', certificationRoutes],
  ['/coding-profiles', codingProfileRoutes],
  ['/social-links', socialLinkRoutes],
  ['/upload', uploadRoutes],
  ['/stats', statsRoutes],
  ['/settings', settingsRoutes],
];

apiEndpoints.forEach(([pathPrefix, router]) => {
  app.use(`/api${pathPrefix}`, router);
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = () => {
  // 1. Bind to port immediately so Render marks service as healthy/live
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });

  // 2. Connect to database in the background with automatic retries
  const connectWithRetry = async (attempt = 1, maxAttempts = 15, delayMs = 6000) => {
    try {
      console.log(`📡 Connecting to MySQL database (attempt ${attempt}/${maxAttempts})...`);
      await connectDB();
      await syncAdminCredentials();
      console.log('✅ MySQL connected and admin account verified successfully.');
    } catch (error) {
      console.error(`❌ Database connection attempt ${attempt}/${maxAttempts} failed:`, error.message);
      if (attempt < maxAttempts) {
        console.log(`⏳ Retrying database connection in ${delayMs / 1000}s...`);
        setTimeout(() => connectWithRetry(attempt + 1, maxAttempts, delayMs), delayMs);
      } else {
        console.error('⚠️ Could not connect to MySQL database after maximum retries. Please verify your DATABASE_URL in Render environment variables.');
      }
    }
  };

  connectWithRetry();
};

export { app, startServer };

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMainModule && process.env.NODE_ENV !== 'test' && !process.argv.includes('--test')) {
  startServer();
}
