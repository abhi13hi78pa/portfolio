# Developer Portfolio with Manageable Admin CMS

A high-performance personal portfolio website built with a dark navy/black recruiter-friendly UI, paired with a full-featured Admin CMS. Every section, asset, profile detail, and resume is 100% dynamically managed from the Admin Dashboard with zero code modifications required.

---

## 🎨 Visual Design Philosophy

- **Dark Navy / Black Background**: Deep aesthetic (`#070913`) matching modern developer portfolios.
- **Rounded Dark Cards**: Clean borders (`#1b253b`) with elevated navy card surfaces (`#0d1322`).
- **Blue / Cyan Accent**: Prominent action buttons (`#00a2ff`), subtle badge highlights, and smooth focus states.
- **Modern Typography**: Inter font with crisp readability and hierarchical spacing.
- **Recruiter-Friendly Layout**: Two-column responsive project showcase, compact skill badges, wide experience cards, horizontal competitive programming handles, and direct resume downloads.
- **Empty States**: If a section has no entries, a clean recruiter-friendly empty card is shown without fake data.

---

## 🚀 Tech Stack

### Frontend
- **React.js 18** with **Vite**
- **Tailwind CSS** with custom dark theme
- **React Router 6** for public navigation and protected admin routes
- **Axios** with JWT interceptors
- **Lucide React** & custom SVG tech icon system

### Backend
- **Node.js** & **Express.js**
- **MySQL** database via **Sequelize ORM** & `mysql2`
- **JWT** (JSON Web Tokens) & **bcryptjs** password hashing
- **Helmet**, **CORS**, and **express-rate-limit**
- **Multer** with **Cloudinary** integration and local storage fallback

---

## 📁 Project Structure

```
p:/portfolio/
├── backend/
│   ├── src/
│   │   ├── config/          # db.js (MySQL auto-create & Sequelize), cloudinary.js
│   │   ├── controllers/     # CRUD controllers for all sections and stats
│   │   ├── middleware/      # authMiddleware, rateLimiter, uploadMiddleware, errorHandler
│   │   ├── models/          # Admin, Profile, Skill, Project, Experience, Education, Certification, CodingProfile, SocialLink, Settings
│   │   ├── routes/          # Express API route modules
│   │   └── server.js        # Express server entry point
│   ├── uploads/             # Local upload storage fallback
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client with JWT interceptors & endpoint helpers
│   │   ├── components/
│   │   │   ├── admin/       # AdminLayout, StatCard, ConfirmModal, FileUploader
│   │   │   ├── common/      # TechIcon, Badge, Button
│   │   │   └── public/      # Navbar, Hero, About, Skills, Projects, Experience, Education, Certifications, CodingProfiles, Connect, Footer, ProjectModal, EmptyState
│   │   ├── context/         # AuthContext
│   │   ├── pages/
│   │   │   ├── admin/       # Login, Dashboard, Profile/Hero, About, Skills, Projects, Experience, Education, Certifications, Profiles, Social, Resume, Settings
│   │   │   └── public/      # PortfolioPage
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
├── package.json             # Root workspace runner scripts
└── README.md
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24.19.0)
- **MySQL**: MySQL 8.x (running locally on port 3306)

### 2. Installation
From the project root:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables

#### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
DATABASE_URL=mysql://root:your_password_here@localhost:3306/portfolio
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=portfolio

JWT_SECRET=super_secret_jwt_portfolio_key_change_in_production_9988776655
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@portfolio.local
ADMIN_PASSWORD=admin123

# Cloudinary (Optional: if empty, local disk storage /uploads/ is used)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> **Note**: The backend automatically executes `CREATE DATABASE IF NOT EXISTS portfolio` and synchronizes all tables on startup.

#### Frontend (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running Locally

Start the backend:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

In a second terminal, start the frontend:
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔐 Admin CMS Access

1. Open your browser and navigate to:
   ```
   http://localhost:5173/admin/login
   ```
2. Default initial login credentials (configured in `.env`):
   - **Email**: `admin@portfolio.local`
   - **Password**: `admin123`
3. After logging in, you will be redirected to `/admin/dashboard`.
4. You can change your password anytime under **Settings** (`/admin/settings`).

---

## ⚙️ Content Management Modules

| Module | Route | What you can manage |
|---|---|---|
| **Dashboard** | `/admin/dashboard` | Real-time database metrics (Projects, Skills, Experience, Education, Certifications, Coding Handles). Shows 0 if empty. |
| **Profile / Hero** | `/admin/profile` | Name, Role badge, Tagline, Hero description, Button labels, and Profile Image. |
| **About** | `/admin/about` | Section heading and multi-line bio. |
| **Skills** | `/admin/skills` | Add/edit/delete skills with icon selector (Python, C++, Docker, Flask, PostgreSQL, etc.), category, and proficiency. |
| **Projects** | `/admin/projects` | Name, Subtitle, Card description, Detailed case study, Tech tags, GitHub link, Live demo link, Screenshot upload, Featured toggle, and Publish/Draft toggle. |
| **Experience** | `/admin/experience` | Job title, Company, Location, Start/End dates, Present toggle, Description, Technologies. |
| **Education** | `/admin/education` | University/College, Degree, Field of study, Start/End year, CGPA/Grade, Description. |
| **Certifications** | `/admin/certifications` | Certificate name, Issuing org, Issue date, Credential ID, Verification link, and Certificate image/file. |
| **Coding Profiles** | `/admin/coding-profiles` | LeetCode, Codeforces, CodeChef, HackerRank, GitHub profiles with custom handles and URLs. |
| **Social Links** | `/admin/social-links` | LinkedIn, GitHub, Email, Twitter/X contacts displayed in "Let's Connect" and the Footer. |
| **Resume** | `/admin/resume` | Upload new PDF/DOC resume, download current resume, or delete. Both public "Download Resume" buttons immediately link to this file. |
| **Settings & SEO** | `/admin/settings` | Browser title, Meta description, OpenGraph title & description, and Admin password change. |

---

## ☁️ Cloudinary Setup (Production File Storage)

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Go to your Cloudinary Dashboard and copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Paste them into `backend/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. All images and resume documents will now be stored in the Cloudinary CDN.

---

## 🚢 Production Deployment

### 1. Backend Deployment (Render)
1. Push your repository to GitHub.
2. Log into [render.com](https://render.com) and click **New + > Web Service**.
3. Connect your repository.
4. Set:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
5. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your production MySQL connection URI (from AWS RDS, PlanetScale, Aiven, or Railway MySQL).
   - `JWT_SECRET`: A strong 64-character secret key.
   - `ADMIN_EMAIL`: Your production admin email.
   - `ADMIN_PASSWORD`: Your initial admin password.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g. `https://your-portfolio.vercel.app`).
   - `NODE_ENV`: `production`

### 2. Frontend Deployment (Vercel)
1. Log into [vercel.com](https://vercel.com) and click **Add New... > Project**.
2. Select your repository.
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your Render backend URL + `/api` (e.g. `https://your-backend.onrender.com/api`).
5. Click **Deploy**. The included `frontend/vercel.json` will automatically handle client-side routing.

---

## 📄 License
MIT License. Created for developer portfolio presentation and content management.
