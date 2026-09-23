import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Page
import { PortfolioPage } from './pages/public/PortfolioPage';

// Admin Pages
import { LoginPage } from './pages/admin/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardOverview } from './pages/admin/DashboardOverview';
import { ProfileHeroPage } from './pages/admin/ProfileHeroPage';
import { AboutManager } from './pages/admin/AboutManager';
import { SkillsManager } from './pages/admin/SkillsManager';
import { ProjectsManager } from './pages/admin/ProjectsManager';
import { ExperienceManager } from './pages/admin/ExperienceManager';
import { EducationManager } from './pages/admin/EducationManager';
import { CertificationsManager } from './pages/admin/CertificationsManager';
import { CodingProfilesManager } from './pages/admin/CodingProfilesManager';
import { SocialLinksManager } from './pages/admin/SocialLinksManager';
import { ResumeManager } from './pages/admin/ResumeManager';
import { SettingsPage } from './pages/admin/SettingsPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <Routes>
      {/* Public Portfolio Route */}
      <Route path="/" element={<PortfolioPage />} />

      {/* Admin Login Route */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="profile" element={<ProfileHeroPage />} />
        <Route path="about" element={<AboutManager />} />
        <Route path="skills" element={<SkillsManager />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="experience" element={<ExperienceManager />} />
        <Route path="education" element={<EducationManager />} />
        <Route path="certifications" element={<CertificationsManager />} />
        <Route path="coding-profiles" element={<CodingProfilesManager />} />
        <Route path="social-links" element={<SocialLinksManager />} />
        <Route path="resume" element={<ResumeManager />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
