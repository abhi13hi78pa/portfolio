import React from 'react';
import { ExternalLink } from 'lucide-react';
import { TechIcon } from '../common/TechIcon';
import { EmptyState } from './EmptyState';

export const CodingProfilesSection = ({ profiles = [] }) => {
  return (
    <section id="profiles" className="py-10 border-t border-slate-900/60">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        Coding Profiles
      </h2>

      {profiles.length === 0 ? (
        <EmptyState
          type="codingProfiles"
          message="No coding profiles added yet."
          description="Competitive programming platforms and coding handles will show here once added."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {profiles.map((profile) => (
            <a
              key={profile.id}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl bg-[#0d1322] border border-[#1b253b] hover:border-slate-700/80 px-4 py-3 flex items-center justify-between transition-all hover:bg-[#111a30]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <TechIcon
                  name={profile.icon || profile.platformName}
                  className="w-5 h-5 shrink-0"
                />
                <div className="truncate">
                  <span className="block text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                    {profile.platformName}
                  </span>
                  {profile.username && (
                    <span className="block text-[11px] text-slate-500 truncate">
                      @{profile.username}
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400 shrink-0 ml-1 transition-colors" />
            </a>
          ))}
        </div>
      )}
    </section>
  );
};
