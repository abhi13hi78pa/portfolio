import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const SectionError = ({ title = 'Failed to load section', onRetry }) => {
  return (
    <div className="py-8 px-6 my-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-center flex flex-col items-center">
      <AlertTriangle className="w-6 h-6 text-rose-400 mb-2" />
      <p className="text-sm font-medium text-slate-300 mb-1">{title}</p>
      <p className="text-xs text-slate-500 mb-3">There was a problem loading this data from the server.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  );
};
