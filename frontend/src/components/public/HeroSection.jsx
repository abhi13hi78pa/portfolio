import React from 'react';
import { Download, FolderGit2 } from 'lucide-react';

export const HeroSection = ({ profile }) => {
  const name = profile?.name || 'Your Name';
  const role = profile?.role || 'Your Role';
  const tagline = profile?.tagline || 'Your professional introduction';
  const resumeUrl = profile?.resumeUrl || '';
  const primaryBtnText = profile?.primaryBtnText || 'Download Resume';
  const secondaryBtnText = profile?.secondaryBtnText || 'View Projects';

  const handleResumeClick = (e) => {
    if (!resumeUrl) {
      e.preventDefault();
      alert('No resume has been uploaded yet. You can upload one from the Admin Dashboard.');
    }
  };

  return (
    <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 text-center flex flex-col items-center">
      {/* Role Badge */}
      {role && (
        <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium tracking-wide bg-[#0c1f38] text-sky-400 border border-sky-900/60 mb-6">
          {role}
        </div>
      )}

      {/* Name */}
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
        {name}
      </h1>

      {/* Tagline / Professional Introduction */}
      {tagline && (
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed mb-8 px-4 font-normal">
          {tagline}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] active:scale-95 transition-all shadow-lg shadow-sky-500/10"
          >
            {primaryBtnText}
          </a>
        ) : (
          <button
            onClick={handleResumeClick}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] active:scale-95 transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
          >
            {primaryBtnText}
          </button>
        )}

        <a
          href="#projects"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium bg-[#0f172a] text-slate-300 border border-slate-800 hover:bg-slate-800/80 hover:text-white transition-all"
        >
          {secondaryBtnText}
        </a>
      </div>
    </section>
  );
};
