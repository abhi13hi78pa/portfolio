import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_32_characters_long!';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_jwt_refresh_secret_32_chars!';

import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  getCookieOptions,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  refreshToken,
  logoutAdmin,
} from '../src/controllers/authController.js';

describe('JWT Security, Token Rotation & Cookie Management', () => {
  const fakeAdmin = {
    id: 99,
    email: 'testadmin@example.com',
    role: 'admin',
  };

  test('generateAccessToken returns a valid JWT with user id and role', () => {
    const token = generateAccessToken(fakeAdmin);
    assert.ok(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    assert.equal(decoded.id, fakeAdmin.id);
    assert.equal(decoded.email, fakeAdmin.email);
    assert.equal(decoded.role, fakeAdmin.role);
    // Should be short-lived (default 15m)
    assert.ok(decoded.exp - decoded.iat <= 15 * 60 + 5);
  });

  test('generateRefreshToken returns a JWT signed with refresh secret and jti', () => {
    const refreshToken = generateRefreshToken(fakeAdmin);
    assert.ok(refreshToken);
    const refreshSecret = process.env.JWT_REFRESH_SECRET || ((process.env.JWT_SECRET || 'secret') + '_refresh');
    const decoded = jwt.verify(refreshToken, refreshSecret);
    assert.equal(decoded.id, fakeAdmin.id);
    assert.ok(decoded.jti);
  });

  test('hashToken produces consistent SHA-256 hex digest', () => {
    const token = 'sample-secret-token-xyz';
    const hash1 = hashToken(token);
    const hash2 = hashToken(token);
    assert.equal(hash1, hash2);
    assert.equal(hash1.length, 64);
  });

  test('getCookieOptions returns HttpOnly and restricted path', () => {
    const opts = getCookieOptions();
    assert.equal(opts.httpOnly, true);
    assert.equal(opts.path, '/api/auth');
    assert.ok(opts.maxAge > 0);
  });

  test('setRefreshTokenCookie sets cookie with proper options', () => {
    let cookieName, cookieVal, cookieOpts;
    const res = {
      cookie(name, val, opts) {
        cookieName = name;
        cookieVal = val;
        cookieOpts = opts;
      },
    };
    setRefreshTokenCookie(res, 'sample-token');
    assert.equal(cookieName, 'refreshToken');
    assert.equal(cookieVal, 'sample-token');
    assert.equal(cookieOpts.httpOnly, true);
  });

  test('clearRefreshTokenCookie clears cookie with maxAge 0', () => {
    let cookieName, cookieOpts;
    const res = {
      clearCookie(name, opts) {
        cookieName = name;
        cookieOpts = opts;
      },
    };
    clearRefreshTokenCookie(res);
    assert.equal(cookieName, 'refreshToken');
    assert.equal(cookieOpts.maxAge, 0);
  });

  test('refreshToken endpoint rejects request when no refresh cookie is present', async () => {
    let status = null;
    let json = null;
    const req = { cookies: {} };
    const res = {
      status(s) { status = s; return this; },
      json(j) { json = j; return this; },
    };

    await refreshToken(req, res);
    assert.equal(status, 401);
    assert.equal(json.message, 'Refresh token not provided');
  });

  test('refreshToken endpoint rejects invalid / forged refresh token', async () => {
    let status = null;
    let json = null;
    let cookieCleared = false;
    const req = { cookies: { refreshToken: 'invalid.forged.jwt' } };
    const res = {
      status(s) { status = s; return this; },
      json(j) { json = j; return this; },
      clearCookie() { cookieCleared = true; },
    };

    await refreshToken(req, res);
    assert.equal(status, 401);
    assert.equal(cookieCleared, true);
  });

  test('logoutAdmin clears refreshToken cookie', async () => {
    let cookieCleared = false;
    let json = null;
    const req = { cookies: { refreshToken: 'any' } };
    const res = {
      clearCookie() { cookieCleared = true; },
      json(j) { json = j; return this; },
    };

    await logoutAdmin(req, res);
    assert.equal(cookieCleared, true);
    assert.equal(json.message, 'Logged out successfully');
  });
});
