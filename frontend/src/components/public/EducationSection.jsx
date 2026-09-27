import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { SafeHtml } from '../common/SafeHtml';

export const EducationSection = ({ education = [] }) => {
  return (
    <section id="education" className="py-10 border-t border-slate-900/60">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        Education
      </h2>

      {education.length === 0 ? (
        <EmptyState
          type="education"
          message="No education details added yet."
          description="Your degrees and academic credentials will appear here once added in Admin."
        />
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="rounded-2xl bg-[#0d1322] border border-[#1b253b] hover:border-slate-700/80 p-5 sm:p-6 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </h3>
                {(edu.startYear || edu.endYear) && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{edu.startYear} – {edu.endYear || 'Present'}</span>
                  </div>
                )}
              </div>

              <p className="text-sm font-medium text-sky-400 mb-2">
                {edu.institution}
              </p>

              {edu.grade && (
                <p className="text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300">Grade / CGPA:</span> {edu.grade}
                </p>
              )}

              {edu.description && (
                <SafeHtml html={edu.description} className="text-sm text-slate-300 leading-relaxed" />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
