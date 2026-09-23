import React from 'react';
import { EmptyState } from './EmptyState';

export const AboutSection = ({ profile }) => {
  const heading = profile?.aboutHeading || 'About';
  const description = profile?.aboutDescription;

  return (
    <section id="about" className="py-10 border-t border-slate-900/60">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
        {heading}
      </h2>
      {description ? (
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {description}
        </p>
      ) : (
        <EmptyState
          type="experience"
          message="No About content added yet."
          description="You can add your bio and background story from the Admin Dashboard."
        />
      )}
    </section>
  );
};
