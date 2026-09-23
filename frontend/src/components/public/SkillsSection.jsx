import React from 'react';
import { TechIcon } from '../common/TechIcon';
import { EmptyState } from './EmptyState';

export const SkillsSection = ({ skills = [] }) => {
  return (
    <section id="skills" className="py-10 border-t border-slate-900/60">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
        Skills
      </h2>

      {skills.length === 0 ? (
        <EmptyState
          type="skills"
          message="No skills added yet."
          description="Add your technologies, languages, and frameworks in the Admin Dashboard."
        />
      ) : (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0d1322] border border-[#1b253b] hover:border-slate-700/80 text-sm font-medium text-slate-200 transition-all hover:bg-[#111a30]"
            >
              <TechIcon name={skill.icon || skill.name} className="w-4 h-4" />
              <span>{skill.name}</span>
              {skill.proficiency && (
                <span className="text-[11px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                  {skill.proficiency}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
