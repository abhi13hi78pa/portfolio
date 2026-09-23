import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const StatCard = ({ title, count, icon: Icon, to, color = 'sky' }) => {
  return (
    <Link
      to={to}
      className="group relative rounded-2xl bg-[#0d1322] border border-[#1b253b] hover:border-slate-700/80 p-5 transition-all hover:bg-[#111a30] flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#141d33] border border-[#1e2a47] flex items-center justify-center text-sky-400 group-hover:text-white transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-slate-600 group-hover:text-sky-400 transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      <div>
        <span className="text-3xl font-extrabold text-white block tracking-tight mb-1">
          {count}
        </span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
      </div>
    </Link>
  );
};
