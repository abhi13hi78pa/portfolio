import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SafeHtml } from '../components/common/SafeHtml';

describe('SafeHtml Component', () => {
  it('renders plain text safely without dangerouslySetInnerHTML', () => {
    const { container } = render(<SafeHtml html="Just a simple text description" />);
    expect(container.textContent).toContain('Just a simple text description');
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('renders legitimate HTML formatting (bold, italic, links)', () => {
    const html = '<p>Check out <strong>awesome</strong> feature and <a href="https://github.com">link</a></p>';
    const { container } = render(<SafeHtml html={html} />);
    expect(container.querySelector('strong')?.textContent).toBe('awesome');
    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://github.com');
  });

  it('sanitizes script tags from user-provided HTML', () => {
    const malicious = '<p>Malicious <script>alert("XSS")</script>content</p>';
    const { container } = render(<SafeHtml html={malicious} />);
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).not.toContain('alert');
    expect(container.textContent).toContain('Malicious content');
  });

  it('sanitizes onerror image tags and removes dangerous img elements', () => {
    const malicious = '<img src="invalid-url" onerror="alert(1)" />Safe text';
    const { container } = render(<SafeHtml html={malicious} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('Safe text');
  });

  it('renders null when html prop is empty', () => {
    const { container } = render(<SafeHtml html="" />);
    expect(container.firstChild).toBeNull();
  });
});
