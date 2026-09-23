import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Award,
  Terminal,
  Share2,
  User,
  Plus,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { statsApi } from '../../api/endpoints';
import { StatCard } from '../../components/admin/StatCard';

export const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsApi.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time content metrics and quick management actions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] transition-all shadow-lg shadow-sky-500/10"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Link>
          <Link
            to="/admin/skills"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#141d33] border border-[#1e2a47] text-slate-200 hover:text-white hover:bg-[#1a2644] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </Link>
        </div>
      </div>

      {/* Database Metric Cards */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400 mb-2" />
          <p className="text-xs">Fetching live database counts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Skills"
            count={stats?.totalSkills ?? 0}
            icon={Sparkles}
            to="/admin/skills"
          />
          <StatCard
            title="Total Projects"
            count={stats?.totalProjects ?? 0}
            icon={FolderGit2}
            to="/admin/projects"
          />
          <StatCard
            title="Total Experience"
            count={stats?.totalExperience ?? 0}
            icon={Briefcase}
            to="/admin/experience"
          />
          <StatCard
            title="Total Education"
            count={stats?.totalEducation ?? 0}
            icon={GraduationCap}
            to="/admin/education"
          />
          <StatCard
            title="Total Certifications"
            count={stats?.totalCertifications ?? 0}
            icon={Award}
            to="/admin/certifications"
          />
          <StatCard
            title="Total Coding Profiles"
            count={stats?.totalCodingProfiles ?? 0}
            icon={Terminal}
            to="/admin/coding-profiles"
          />
        </div>
      )}

      {/* Quick Access Grid */}
      <div className="rounded-2xl bg-[#0d1322] border border-[#1b253b] p-6">
        <h3 className="text-base font-bold text-white mb-4">Quick Management</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium">
          <Link
            to="/admin/profile"
            className="p-3.5 rounded-xl bg-[#070913] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center gap-2.5 transition-colors"
          >
            <User className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Hero & Profile</span>
          </Link>
          <Link
            to="/admin/resume"
            className="p-3.5 rounded-xl bg-[#070913] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center gap-2.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Manage Resume</span>
          </Link>
          <Link
            to="/admin/social-links"
            className="p-3.5 rounded-xl bg-[#070913] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center gap-2.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Social & Connect</span>
          </Link>
          <Link
            to="/admin/settings"
            className="p-3.5 rounded-xl bg-[#070913] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center gap-2.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>SEO & Password</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
