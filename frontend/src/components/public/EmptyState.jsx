import React from 'react';
import { FolderGit2, Sparkles, Briefcase, GraduationCap, Award, Terminal, Share2 } from 'lucide-react';

const iconMap = {
  projects: FolderGit2,
  skills: Sparkles,
  experience: Briefcase,
  education: GraduationCap,
  certifications: Award,
  codingProfiles: Terminal,
  socialLinks: Share2,
};

export const EmptyState = ({ type = 'projects', message, description }) => {
  const Icon = iconMap[type] || FolderGit2;

  const defaultMessages = {
    projects: 'No projects added yet.',
    skills: 'No skills added yet.',
    experience: 'No experience added yet.',
    education: 'No education details added yet.',
    certifications: 'No certifications added yet.',
    codingProfiles: 'No coding profiles added yet.',
    socialLinks: 'No contact links added yet.',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-slate-800/80 bg-[#0d1322]/40 text-center my-4 transition-all">
      <div className="w-12 h-12 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium text-slate-400">
        {message || defaultMessages[type] || 'No items added yet.'}
      </p>
      {description && (
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
};
