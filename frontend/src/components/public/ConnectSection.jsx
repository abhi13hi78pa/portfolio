import React from 'react';
import { ExternalLink, Download } from 'lucide-react';
import { TechIcon } from '../common/TechIcon';
import { EmptyState } from './EmptyState';

export const ConnectSection = ({ links = [], profile }) => {
  const resumeUrl = profile?.resumeUrl;
  const primaryBtnText = profile?.primaryBtnText || 'Download Resume';

  const handleResumeClick = (e) => {
    if (!resumeUrl) {
      e.preventDefault();
      alert('No resume uploaded yet. Upload one via the Admin Dashboard.');
    }
  };

  return (
    <section id="connect" className="py-10 border-t border-slate-900/60">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        Let's Connect
      </h2>

      {links.length === 0 ? (
        <EmptyState
          type="socialLinks"
          message="No contact links added yet."
          description="Add your LinkedIn, GitHub, or Email from the Admin Dashboard."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {links.map((link) => {
            const isEmail = link.urlOrValue.includes('@') && !link.urlOrValue.startsWith('http');
            const href = isEmail ? `mailto:${link.urlOrValue}` : link.urlOrValue;

            return (
              <a
                key={link.id}
                href={href}
                target={isEmail ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="group rounded-xl bg-[#0d1322] border border-[#1b253b] hover:border-slate-700/80 px-5 py-3.5 flex items-center justify-between transition-all hover:bg-[#111a30]"
              >
                <div className="flex items-center gap-3 truncate">
                  <TechIcon
                    name={link.icon || link.platform}
                    className="w-5 h-5 text-sky-400 shrink-0"
                  />
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                    {link.urlOrValue.length > 30 ? link.platform : link.urlOrValue}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-sky-400 shrink-0 ml-2 transition-colors" />
              </a>
            );
          })}
        </div>
      )}

      {/* Download Resume Button below connect section as seen in screenshot */}
      <div className="pt-2">
        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] active:scale-95 transition-all shadow-lg shadow-sky-500/10"
          >
            {primaryBtnText}
          </a>
        ) : (
          <button
            onClick={handleResumeClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#00a2ff] text-slate-950 hover:bg-[#0091e6] active:scale-95 transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
          >
            {primaryBtnText}
          </button>
        )}
      </div>
    </section>
  );
};
