import React from 'react';

export const SectionSkeleton = ({ title = '', count = 2, type = 'card' }) => {
  return (
    <div className="py-10 border-t border-slate-900/60 animate-pulse">
      {title && (
        <div className="h-6 w-32 bg-slate-800/60 rounded-md mb-6"></div>
      )}

      {type === 'hero' && (
        <div className="pt-28 pb-16 text-center flex flex-col items-center">
          <div className="h-6 w-28 bg-slate-800/60 rounded-full mb-6"></div>
          <div className="h-10 sm:h-12 w-64 sm:w-80 bg-slate-800/60 rounded-lg mb-4"></div>
          <div className="h-4 w-72 sm:w-96 bg-slate-800/40 rounded-md mb-8"></div>
          <div className="flex gap-3">
            <div className="h-10 w-36 bg-slate-800/60 rounded-lg"></div>
            <div className="h-10 w-32 bg-slate-800/40 rounded-lg"></div>
          </div>
        </div>
      )}

      {type === 'badges' && (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-slate-800/50 rounded-xl"></div>
          ))}
        </div>
      )}

      {type === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#0d1322] border border-[#1b253b]/60 p-5 h-44 flex flex-col justify-between">
              <div>
                <div className="h-4 w-1/2 bg-slate-800/60 rounded mb-2"></div>
                <div className="h-3 w-3/4 bg-slate-800/40 rounded mb-2"></div>
                <div className="h-3 w-2/3 bg-slate-800/30 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-14 bg-slate-800/50 rounded"></div>
                <div className="h-5 w-14 bg-slate-800/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'list' && (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-[#0d1322] border border-[#1b253b]/60 p-5 h-28 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="h-4 w-40 bg-slate-800/60 rounded"></div>
                <div className="h-3 w-24 bg-slate-800/40 rounded"></div>
              </div>
              <div className="h-3 w-3/4 bg-slate-800/30 rounded"></div>
              <div className="h-3 w-1/2 bg-slate-800/30 rounded"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
