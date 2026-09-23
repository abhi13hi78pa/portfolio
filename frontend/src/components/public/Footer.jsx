import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export const Footer = ({ profile, socialLinks = [] }) => {
  const currentYear = new Date().getFullYear();
  const name = profile?.name || 'Your Name';
  const role = profile?.role || 'Developer';

  return (
    <footer className="mt-16 pt-8 pb-12 border-t border-slate-900/60 text-center">
      {/* Social quick links */}
      {socialLinks.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {socialLinks.map((link) => {
            const isEmail = link.urlOrValue.includes('@') && !link.urlOrValue.startsWith('http');
            const href = isEmail ? `mailto:${link.urlOrValue}` : link.urlOrValue;

            return (
              <a
                key={link.id}
                href={href}
                target={isEmail ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#0d1322] border border-[#1b253b] text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                {link.platform}
              </a>
            );
          })}
        </div>
      )}

      {/* Copyright line */}
      <p className="text-xs text-slate-500 font-medium">
        &copy; {currentYear} {name} &ndash; {role}
      </p>

      {/* Admin shortcut */}
      <div className="mt-3">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
        >
          <Lock className="w-3 h-3" /> Admin Portal
        </Link>
      </div>
    </footer>
  );
};
