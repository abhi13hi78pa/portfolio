import React from 'react';
import DOMPurify from 'dompurify';

/**
 * Safely renders rich-text / HTML content sanitized with DOMPurify.
 * Ensures no script injection, malicious event handlers, or javascript: URIs can execute.
 */
export const SafeHtml = ({ html, className = '', as = 'div' }) => {
  if (!html) return null;

  // Check if content actually contains HTML tags
  const hasHtml = /<[a-z][\s\S]*>/i.test(html);

  if (!hasHtml) {
    const Component = as;
    return <Component className={`whitespace-pre-line ${className}`}>{html}</Component>;
  }

  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'code', 'pre', 'hr',
      'a', 'span',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'title'],
  });

  const Component = as;
  return (
    <Component
      className={`prose prose-invert max-w-none text-slate-300 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};
