import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeRichText, sanitizePlainText } from '../src/utils/sanitize.js';

describe('Rich-Text and Plain-Text Sanitization', () => {
  test('strips dangerous <script> tags completely', () => {
    const malicious = '<p>Hello <script>alert("XSS")</script>World</p>';
    const sanitized = sanitizeRichText(malicious);
    assert.equal(sanitized.includes('<script>'), false);
    assert.equal(sanitized.includes('alert'), false);
    assert.equal(sanitized, '<p>Hello World</p>');
  });

  test('strips onerror and onclick event handlers', () => {
    const malicious = '<img src="x" onerror="alert(1)" /><b onclick="steal()">Click me</b>';
    const sanitized = sanitizeRichText(malicious);
    assert.equal(sanitized.includes('onerror'), false);
    assert.equal(sanitized.includes('onclick'), false);
    assert.equal(sanitized.includes('steal'), false);
    assert.equal(sanitized, '<b>Click me</b>');
  });

  test('neutralizes javascript: pseudo-protocol in links', () => {
    const malicious = '<a href="javascript:alert(document.cookie)">Malicious link</a>';
    const sanitized = sanitizeRichText(malicious);
    assert.equal(sanitized.includes('javascript:'), false);
  });

  test('strips <iframe> and <object> tags', () => {
    const malicious = '<p>Check this <iframe src="http://attacker.com"></iframe></p>';
    const sanitized = sanitizeRichText(malicious);
    assert.equal(sanitized.includes('<iframe'), false);
    assert.equal(sanitized, '<p>Check this </p>');
  });

  test('preserves legitimate rich-text formatting (bold, italic, lists, links)', () => {
    const safeInput = '<p>This is <strong>bold</strong> and <em>italic</em> with a <a href="https://example.com" target="_blank">link</a></p><ul><li>Item 1</li><li>Item 2</li></ul>';
    const sanitized = sanitizeRichText(safeInput);
    assert.equal(sanitized.includes('<strong>bold</strong>'), true);
    assert.equal(sanitized.includes('<em>italic</em>'), true);
    assert.equal(sanitized.includes('<ul><li>Item 1</li><li>Item 2</li></ul>'), true);
    assert.equal(sanitized.includes('rel="noopener noreferrer"'), true);
  });

  test('sanitizePlainText strips all HTML tags entirely', () => {
    const dirty = '<h1>Senior Developer</h1><p>Description</p>';
    const sanitized = sanitizePlainText(dirty);
    assert.equal(sanitized, 'Senior DeveloperDescription');
  });

  test('handles null and undefined safely without throwing', () => {
    assert.equal(sanitizeRichText(null), '');
    assert.equal(sanitizeRichText(undefined), '');
    assert.equal(sanitizePlainText(null), '');
    assert.equal(sanitizePlainText(undefined), '');
  });
});
