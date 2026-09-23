import React from 'react';
import * as LucideIcons from 'lucide-react';

export const TechIcon = ({ name, className = "w-5 h-5", fallback = "Code" }) => {
  if (!name) {
    const FallbackIcon = LucideIcons[fallback] || LucideIcons.Code;
    return <FallbackIcon className={className} />;
  }

  // If it's an image or uploaded asset URL
  if (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('/uploads')) {
    return <img src={name} alt="" className={`${className} object-contain rounded`} />;
  }

  const normalized = name.toLowerCase().replace(/[\s\-_.]/g, '');

  // Recognized tech and platform SVGs
  switch (normalized) {
    case 'cpp':
    case 'c':
    case 'cplusplus':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 14h-2v-3H8v-2h3V8h2v3h3v2h-3z" fill="#00599C" />
          <path d="M9.5 8.5a4.5 4.5 0 100 7 1 1 0 011.4 1.4 6.5 6.5 0 110-9.8 1 1 0 01-1.4 1.4z" fill="#659AD2" />
        </svg>
      );
    case 'python':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M11.9 2c-4.3 0-4 1.9-4 1.9v2h4.2v.6H6.1s-3 .3-3 4.2c0 3.8 2.6 3.7 2.6 3.7h1.6v-2.2s-.1-2.6 2.6-2.6h4.5s2.5 0 2.5-2.5V4.4s.3-2.4-4-2.4h-2.4zm-1.2 1.4a.8.8 0 11-.8.8.8.8 0 01.8-.8zm7.2 6.5s.1 2.6-2.6 2.6h-4.5s-2.5 0-2.5 2.5v2.8s-.3 2.4 4 2.4h2.4c4.3 0 4-1.9 4-1.9v-2h-4.2v-.6h6s3-.3 3-4.2c0-3.8-2.6-3.7-2.6-3.7h-1.6v2.2zm-4.7 9.8a.8.8 0 11.8-.8.8.8 0 01-.8.8z" fill="#3776AB" />
        </svg>
      );
    case 'java':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M9.2 19.4s-.8.6.6.8c1.6.2 2.8.2 4.9-.3 0 0 .7.5 1.5.3 0 0-4.6 2-7-.8zm-1.2-2.3s-.9.7.5.9c2 .3 3.9.3 7-.3 0 0 .5.4 1.2.3 0 0-5.4 1.7-8.7-.9zm3.8-4.9c.7.8.6 1.4-.4 2.3-1.6 1.4-2.5 2.1-5.1 1.2 0 0-.5.6.4.8 2.8.6 4.7.1 6.8-1.5 2.3-1.8 1.4-3.4-.6-4.5-2.2-1.3-1.4-2.8-.7-4.1-1.3 1.2-2 3.8-.4 5.8zm5.7 3.3c.4-.7 1-1.2 1-1.8 0-.4-.3-.6-.6-.7s-.5 0-.5.2c0 .4-.3.7-.7 1-.3.3-.4.8-.4 1.1.4.2.8.2 1.2.2zm-4.6-13.5c.3.5.3 1-.3 1.7-1 1-1.8 1.9-1.3 3.3.4-1.4 1.8-2.2 2.6-3.3.7-1 .3-2-.7-2.7-.1.3-.2.7-.3 1z" fill="#E76F00" />
        </svg>
      );
    case 'flask':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.31L4.62 17.6A2 2 0 0 0 6.31 21h11.38a2 2 0 0 0 1.69-3.4L14 9.31V2" />
          <path d="M8.5 2h7" />
          <path d="M7 16h10" />
        </svg>
      );
    case 'postgresql':
    case 'postgres':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2C6.5 2 2 6.5 2 12c0 3.3 1.6 6.3 4.1 8.1.3-.5.7-1 .9-1.5-.7-.4-1.3-.9-1.8-1.5 1.5.5 3 .7 4.6.6-.1-.7-.2-1.5-.1-2.2-.6-.2-1.2-.5-1.7-.9.8-.3 1.6-.4 2.4-.4.2-1.1.7-2.1 1.5-2.9-1.4-.4-2.4-1.6-2.5-3.1 1.1.5 2.3.6 3.5.3.6-.9 1.6-1.5 2.7-1.7-.1-.6-.1-1.2 0-1.8 1.5.7 2.6 2 3 3.6.8-.2 1.7-.2 2.5.1-.4 1.3-1.4 2.3-2.7 2.6.4 1 .5 2.1.2 3.1 1.1-.1 2.2-.4 3.2-1-.3.7-.8 1.3-1.4 1.8.8.4 1.6.6 2.5.7C21.7 15.6 22 13.8 22 12c0-5.5-4.5-10-10-10z" fill="#336791" />
        </svg>
      );
    case 'docker':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M13.9 10.6H12V8.7h1.9v1.9zm-2.8 0H9.2V8.7h1.9v1.9zm-2.8 0H6.4V8.7h1.9v1.9zm5.6-2.8H12V5.9h1.9v1.9zm-2.8 0H9.2V5.9h1.9v1.9zm8.5 3.3c-.4-.3-1.5-.4-2.4.2-.1-.7-.5-1.4-1-1.9l-.6-.4-.4.6c-.4.6-.5 1.4-.2 2.2-.4.2-1.4.3-1.7.3H3.6c-.5 0-.9.4-.9.9 0 1.9.5 3.7 1.6 5.2C6 19.7 8.3 21 11.5 21c5.4 0 9.7-3.4 9.9-8.4v-.4c0-.4-.4-.8-1.5-1.1z" fill="#2496ED" />
        </svg>
      );
    case 'git':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M21.6 10.9L13.1 2.4a2.2 2.2 0 00-3.1 0L8.4 4 10.7 6.3a2.6 2.6 0 013.3 3.3l2.2 2.2a2.6 2.6 0 012.8 4.3 2.6 2.6 0 01-3.7-3.7l-2.1-2.1v5.1a2.6 2.6 0 11-1.8 0V9.8a2.6 2.6 0 01-1.4-3.4L7.6 4.1 2.4 9.3a2.2 2.2 0 000 3.1l8.5 8.5c.9.9 2.3.9 3.1 0l7.6-7.6c.9-.8.9-2.3 0-3.1z" fill="#F05032" />
        </svg>
      );
    case 'linux':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12.4 2C9.9 2 8.7 3.6 8.7 6.1c0 1.2.3 2.6.7 3.7-1 .8-1.9 2-1.9 3.7 0 1.3.5 2.5 1.4 3.3-.9 1.1-1.7 2.4-1.7 4 0 .9.8 1.2 1.6 1.2 1.5 0 3-1 4.5-1 1.6 0 3.1 1 4.6 1 .8 0 1.6-.3 1.6-1.2 0-1.6-.8-2.9-1.7-4 .9-.8 1.4-2 1.4-3.3 0-1.7-.9-2.9-1.9-3.7.4-1.1.7-2.5.7-3.7C17.3 3.6 14.9 2 12.4 2zm-1.8 3.5a.9.9 0 110 1.8.9.9 0 010-1.8zm3.6 0a.9.9 0 110 1.8.9.9 0 010-1.8zm-1.8 2.2c.6 0 1.1.3 1.1.7s-.5.7-1.1.7-1.1-.3-1.1-.7.5-.7 1.1-.7z" fill="#FCC624" />
        </svg>
      );
    case 'leetcode':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M13.48 4.18a1.2 1.2 0 00-1.7 0L5.34 10.6a5.7 5.7 0 000 8.06 5.7 5.7 0 008.06 0l4.3-4.3a1.2 1.2 0 10-1.7-1.7l-4.3 4.3a3.3 3.3 0 01-4.66 0 3.3 3.3 0 010-4.66l6.44-6.44a1.2 1.2 0 000-1.7z" fill="#FFA116" />
          <path d="M10 12h10a1.2 1.2 0 000-2.4H10a1.2 1.2 0 000 2.4z" fill="#FFFFFF" />
        </svg>
      );
    case 'codeforces':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <rect x="2" y="10" width="4.5" height="11" rx="1" fill="#FFC107" />
          <rect x="9.5" y="4" width="4.5" height="17" rx="1" fill="#2196F3" />
          <rect x="17" y="7.5" width="4.5" height="13.5" rx="1" fill="#F44336" />
        </svg>
      );
    case 'codechef':
      return (
        <div className={`flex items-center justify-center font-bold text-xs bg-[#5B4638] text-white rounded px-1 ${className}`}>
          CC
        </div>
      );
    case 'hackerrank':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#00EA64">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 14.5h-2v-4H8.5V10H11V7.5h2V10h2.5v2.5H13z" />
        </svg>
      );
    case 'linkedin':
      return <LucideIcons.Linkedin className={className} />;
    case 'github':
      return <LucideIcons.Github className={className} />;
    case 'email':
    case 'mail':
      return <LucideIcons.Mail className={className} />;
    case 'twitter':
    case 'x':
      return <LucideIcons.Twitter className={className} />;
    default: {
      // Check if Lucide has this component (PascalCase)
      const pascal = name.charAt(0).toUpperCase() + name.slice(1);
      const IconComp = LucideIcons[pascal] || LucideIcons[name] || LucideIcons[fallback] || LucideIcons.Code;
      return <IconComp className={className} />;
    }
  }
};
