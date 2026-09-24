import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
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

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/$/, '');
    if (
      allowedOrigins.includes(normalized) ||
      allowedOrigins.includes('*') ||
      normalized.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: isDbConnected ? 'ok' : 'degraded',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// API Routes - mounted on both /api/* and /* for full compatibility
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
  app.use(pathPrefix, router);
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

startServer();
