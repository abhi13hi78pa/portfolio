import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { EmptyState } from './EmptyState';

export const ExperienceSection = ({ experience = [] }) => {
  return (
    <section id="experience" className="py-10 border-t border-slate-900/60">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        Experience
      </h2>

      {experience.length === 0 ? (
        <EmptyState
          type="experience"
          message="No experience added yet."
          description="Your professional roles and internships will appear here once added in Admin."
        />
      ) : (
        <div className="space-y-4">
          {experience.map((exp) => {
            const techs = Array.isArray(exp.technologies)
              ? exp.technologies
              : typeof exp.technologies === 'string'
              ? JSON.parse(exp.technologies || '[]')
              : [];

            return (
              <div
                key={exp.id}
                className="rounded-2xl bg-[#0d1322] border border-[#1b253b] hover:border-slate-700/80 p-5 sm:p-6 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {exp.jobTitle} – <span className="text-sky-400">{exp.company}</span>
                    {exp.isCurrent && (
                      <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                        Present
                      </span>
                    )}
                  </h3>
                  {(exp.startDate || exp.endDate) && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                    </div>
                  )}
                </div>

                {exp.location && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {exp.location}
                  </p>
                )}

                {exp.description && (
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                    {exp.description}
                  </p>
                )}

                {techs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {techs.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-slate-400 bg-[#141d33] border border-[#1e2a47] px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
