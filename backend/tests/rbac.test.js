import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { requireRole } from '../src/middleware/authMiddleware.js';

import projectRoutes from '../src/routes/projectRoutes.js';
import skillRoutes from '../src/routes/skillRoutes.js';
import experienceRoutes from '../src/routes/experienceRoutes.js';
import educationRoutes from '../src/routes/educationRoutes.js';
import certificationRoutes from '../src/routes/certificationRoutes.js';
import codingProfileRoutes from '../src/routes/codingProfileRoutes.js';
import socialLinkRoutes from '../src/routes/socialLinkRoutes.js';
import profileRoutes from '../src/routes/profileRoutes.js';
import uploadRoutes from '../src/routes/uploadRoutes.js';
import statsRoutes from '../src/routes/statsRoutes.js';
import settingsRoutes from '../src/routes/settingsRoutes.js';

describe('Admin RBAC Middleware and Route Protection', () => {
  test('requireRole allows access when user role matches', () => {
    let nextCalled = false;
    const req = { admin: { id: 1, role: 'admin' } };
    const res = {};
    const next = () => { nextCalled = true; };

    const middleware = requireRole('admin');
    middleware(req, res, next);

    assert.equal(nextCalled, true);
  });

  test('requireRole returns 403 Forbidden when user role is viewer/non-admin', () => {
    let statusSet = null;
    let jsonPayload = null;
    let nextCalled = false;

    const req = { admin: { id: 2, role: 'viewer' } };
    const res = {
      status(code) {
        statusSet = code;
        return this;
      },
      json(data) {
        jsonPayload = data;
        return this;
      },
    };
    const next = () => { nextCalled = true; };

    const middleware = requireRole('admin');
    middleware(req, res, next);

    assert.equal(nextCalled, false);
    assert.equal(statusSet, 403);
    assert.equal(jsonPayload?.message, 'Forbidden: insufficient role');
  });

  test('requireRole returns 403 Forbidden when req.admin is missing', () => {
    let statusSet = null;
    let nextCalled = false;

    const req = {};
    const res = {
      status(code) {
        statusSet = code;
        return this;
      },
      json(data) {
        return this;
      },
    };
    const next = () => { nextCalled = true; };

    const middleware = requireRole('admin');
    middleware(req, res, next);

    assert.equal(nextCalled, false);
    assert.equal(statusSet, 403);
  });

  // Helper to extract stack handlers for an Express router
  const inspectMutatingRoutes = (router) => {
    const mutatingLayers = [];
    for (const layer of router.stack) {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).filter(m => ['post', 'put', 'patch', 'delete'].includes(m));
        if (methods.length > 0) {
          mutatingLayers.push({
            path: layer.route.path,
            methods,
            stackLength: layer.route.stack.length,
          });
        }
      }
    }
    return mutatingLayers;
  };

  test('every mutating route in projects has multiple middleware layers (protect + requireRole)', () => {
    const routes = inspectMutatingRoutes(projectRoutes);
    assert.ok(routes.length >= 4, 'Should have POST, PUT, DELETE routes');
    for (const r of routes) {
      // Must have protect + requireRole + controller -> stack length >= 3
      assert.ok(r.stackLength >= 3, `Project route ${r.methods.join(',')} ${r.path} lacks RBAC protection`);
    }
  });

  test('every mutating route in skills has multiple middleware layers (protect + requireRole)', () => {
    const routes = inspectMutatingRoutes(skillRoutes);
    assert.ok(routes.length >= 4);
    for (const r of routes) {
      assert.ok(r.stackLength >= 3, `Skill route ${r.methods.join(',')} ${r.path} lacks RBAC protection`);
    }
  });

  test('every mutating route in experience has multiple middleware layers (protect + requireRole)', () => {
    const routes = inspectMutatingRoutes(experienceRoutes);
    assert.ok(routes.length >= 3);
    for (const r of routes) {
      assert.ok(r.stackLength >= 3, `Experience route ${r.methods.join(',')} ${r.path} lacks RBAC protection`);
    }
  });

  test('every mutating route in education has multiple middleware layers (protect + requireRole)', () => {
    const routes = inspectMutatingRoutes(educationRoutes);
    assert.ok(routes.length >= 3);
    for (const r of routes) {
      assert.ok(r.stackLength >= 3, `Education route ${r.methods.join(',')} ${r.path} lacks RBAC protection`);
    }
  });

  test('every mutating route in certifications has multiple middleware layers (protect + requireRole)', () => {
    const routes = inspectMutatingRoutes(certificationRoutes);
    assert.ok(routes.length >= 3);
    for (const r of routes) {
      assert.ok(r.stackLength >= 3, `Certification route ${r.methods.join(',')} ${r.path} lacks RBAC protection`);
    }
  });

  test('every mutating route in coding-profiles has multiple middleware layers (protect + requireRole)', () => {
    const routes = inspectMutatingRoutes(codingProfileRoutes);
    assert.ok(routes.length >= 3);
    for (const r of routes) {
      assert.ok(r.stackLength >= 3, `Coding profile route ${r.methods.join(',')} ${r.path} lacks RBAC protection`);
    }
  });

  test('every mutating route in social-links has multiple middleware layers (protect + requireRole)', () => {
    const routes = inspectMutatingRoutes(socialLinkRoutes);
    assert.ok(routes.length >= 3);
    for (const r of routes) {
      assert.ok(r.stackLength >= 3, `Social link route ${r.methods.join(',')} ${r.path} lacks RBAC protection`);
    }
  });

  test('mutating route in profile has multiple middleware layers (protect + requireRole)', () => {
    const routes = inspectMutatingRoutes(profileRoutes);
    assert.ok(routes.length >= 1);
    for (const r of routes) {
      assert.ok(r.stackLength >= 3, `Profile route ${r.methods.join(',')} ${r.path} lacks RBAC protection`);
    }
  });

  test('mutating route in settings has multiple middleware layers (protect + requireRole)', () => {
    const routes = inspectMutatingRoutes(settingsRoutes);
    assert.ok(routes.length >= 1);
    for (const r of routes) {
      assert.ok(r.stackLength >= 3, `Settings route ${r.methods.join(',')} ${r.path} lacks RBAC protection`);
    }
  });

  test('upload routes have protect and requireRole before upload handler', () => {
    const routes = inspectMutatingRoutes(uploadRoutes);
    assert.ok(routes.length >= 2);
    for (const r of routes) {
      // protect + requireRole + multer + uploadFile = at least 4 handlers
      assert.ok(r.stackLength >= 4, `Upload route ${r.methods.join(',')} ${r.path} lacks RBAC protection`);
    }
  });
});
