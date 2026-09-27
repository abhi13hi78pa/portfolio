import sanitizeHtml from 'sanitize-html';

const RICH_TEXT_OPTIONS = {
  allowedTags: [
    'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre', 'hr',
    'a', 'span',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'title'],
    span: ['class'],
    code: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || '';
      // Ensure no javascript: or data: URIs bypass
      if (/^\s*(javascript|data|vbscript):/i.test(href)) {
        return { tagName: 'span', attribs: {} };
      }
      return {
        tagName: 'a',
        attribs: {
          ...attribs,
          target: attribs.target || '_blank',
          rel: 'noopener noreferrer',
        },
      };
    },
  },
  disallowedTagsModes: 'discard',
};

const PLAIN_TEXT_OPTIONS = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsModes: 'discard',
};

/**
 * Sanitizes rich-text strings, allowing safe HTML tags while stripping dangerous elements,
 * scripts, iframes, onerror handlers, and javascript: links.
 */
export const sanitizeRichText = (dirty) => {
  if (dirty === null || dirty === undefined) return '';
  if (typeof dirty !== 'string') return String(dirty);
  return sanitizeHtml(dirty.trim(), RICH_TEXT_OPTIONS);
};

/**
 * Strips all HTML tags and unsafe content for plain-text fields.
 */
export const sanitizePlainText = (dirty) => {
  if (dirty === null || dirty === undefined) return '';
  if (typeof dirty !== 'string') return String(dirty);
  return sanitizeHtml(dirty.trim(), PLAIN_TEXT_OPTIONS);
};
