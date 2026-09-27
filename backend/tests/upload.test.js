import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { upload } from '../src/middleware/uploadMiddleware.js';

describe('File Upload Validation & Security', () => {
  const fileFilter = upload.fileFilter;

  test('accepts valid image uploads (JPEG, PNG, WebP, SVG)', () => {
    const validImages = [
      { originalname: 'avatar.jpeg', mimetype: 'image/jpeg' },
      { originalname: 'photo.jpg', mimetype: 'image/jpeg' },
      { originalname: 'logo.png', mimetype: 'image/png' },
      { originalname: 'graphic.webp', mimetype: 'image/webp' },
      { originalname: 'icon.svg', mimetype: 'image/svg+xml' },
    ];

    for (const file of validImages) {
      let passed = false;
      let filterError = null;
      fileFilter({}, file, (err, accept) => {
        filterError = err;
        passed = accept;
      });
      assert.equal(filterError, null);
      assert.equal(passed, true, `Expected ${file.originalname} to be accepted`);
    }
  });

  test('accepts valid resume documents (PDF, DOC, DOCX)', () => {
    const validDocs = [
      { originalname: 'resume.pdf', mimetype: 'application/pdf' },
      { originalname: 'cv.doc', mimetype: 'application/msword' },
      { originalname: 'resume.docx', mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    ];

    for (const file of validDocs) {
      let passed = false;
      let filterError = null;
      fileFilter({}, file, (err, accept) => {
        filterError = err;
        passed = accept;
      });
      assert.equal(filterError, null);
      assert.equal(passed, true, `Expected ${file.originalname} to be accepted`);
    }
  });

  test('rejects dangerous and unapproved file extensions (.exe, .sh, .html, .js, .php)', () => {
    const dangerousFiles = [
      { originalname: 'malware.exe', mimetype: 'application/x-msdownload' },
      { originalname: 'exploit.sh', mimetype: 'application/x-sh' },
      { originalname: 'phishing.html', mimetype: 'text/html' },
      { originalname: 'script.js', mimetype: 'application/javascript' },
      { originalname: 'backdoor.php', mimetype: 'application/x-httpd-php' },
    ];

    for (const file of dangerousFiles) {
      let filterError = null;
      fileFilter({}, file, (err, accept) => {
        filterError = err;
      });
      assert.ok(filterError, `Expected dangerous file ${file.originalname} to be rejected`);
      assert.ok(filterError.message.includes('Unsupported file format'));
    }
  });

  test('rejects mismatched extension and mimetype (e.g. executable disguised as .png)', () => {
    const disguisedFile = {
      originalname: 'virus.png',
      mimetype: 'application/x-msdownload', // spoofed extension with executable mime
    };

    let filterError = null;
    fileFilter({}, disguisedFile, (err, accept) => {
      filterError = err;
    });
    assert.ok(filterError);
    assert.ok(filterError.message.includes('Unsupported file format'));
  });

  test('enforces file size limits (10MB)', () => {
    assert.equal(upload.limits.fileSize, 10 * 1024 * 1024);
  });
});
