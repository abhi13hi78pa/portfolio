import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Shield, Lock } from 'lucide-react';

export const Navbar = ({ profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Profiles', href: '#profiles' },
    { label: 'Connect', href: '#connect' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#070913]/85 border-b border-slate-800/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="#" className="font-bold text-white text-base tracking-tight hover:text-sky-400 transition-colors">
          {profile?.name || 'Portfolio'}
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/admin"
            title="Admin CMS"
            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800/60 transition-all ml-2"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/admin"
            title="Admin CMS"
            className="p-1.5 text-slate-400 hover:text-sky-400"
          >
            <Lock className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070913] border-b border-slate-800 px-4 py-3 space-y-2 text-sm font-medium">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sky-400 hover:text-sky-300 font-semibold"
          >
            Admin Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
};
