import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import jwt from 'jsonwebtoken';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_32_characters_long!';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_jwt_refresh_secret_32_chars!';
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@portfolio.local';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'secretpassword';

import { app } from '../src/server.js';
import { Admin } from '../src/models/Admin.js';

describe('API Integration Tests - Authentication, RBAC, and Public Routes', () => {
  test('GET /api/health returns 200 status', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.ok(res.body.status);
    assert.ok(res.body.timestamp);
  });

  test('POST /api/projects without token returns 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ name: 'Unauthorized Project' });
    assert.equal(res.status, 401);
    assert.equal(res.body.message, 'Not authorized, no token provided');
  });

  test('PUT /api/profile without token returns 401 Unauthorized', async () => {
    const res = await request(app)
      .put('/api/profile')
      .send({ name: 'Hacker' });
    assert.equal(res.status, 401);
  });

  test('DELETE /api/skills/1 without token returns 401 Unauthorized', async () => {
    const res = await request(app).delete('/api/skills/1');
    assert.equal(res.status, 401);
  });

  test('Mutating admin route returns 403 Forbidden when authenticated as non-admin role', async () => {
    // Generate valid token for a user with 'viewer' role
    const viewerAdmin = Admin.build({
      id: 9999,
      email: 'viewer@portfolio.local',
      role: 'viewer',
    });
    // Stub findByPk for the test
    const originalFindByPk = Admin.findByPk;
    Admin.findByPk = async (id) => {
      if (id === 9999) return viewerAdmin;
      return null;
    };

    try {
      const viewerToken = jwt.sign(
        { id: 9999, role: 'viewer', email: 'viewer@portfolio.local' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${viewerToken}`)
        .send({ name: 'Attacker Project' });

      assert.equal(res.status, 403);
      assert.equal(res.body.message, 'Forbidden: insufficient role');
    } finally {
      Admin.findByPk = originalFindByPk;
    }
  });

  test('POST /api/auth/refresh returns 401 when no cookie is provided', async () => {
    const res = await request(app).post('/api/auth/refresh');
    assert.equal(res.status, 401);
    assert.equal(res.body.message, 'Refresh token not provided');
  });

  test('POST /api/auth/login returns 400 when missing email or password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Email and password are required');
  });

  test('POST /api/auth/logout clears cookie and returns 200', async () => {
    const res = await request(app).post('/api/auth/logout');
    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Logged out successfully');
    // Verify Set-Cookie header contains Max-Age=0 or expires in past
    const setCookie = res.headers['set-cookie'];
    if (setCookie) {
      assert.ok(setCookie.some(c => c.includes('refreshToken=;')));
    }
  });
});
