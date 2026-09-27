import express from 'express';
import {
  loginAdmin,
  verify2FA,
  generate2FA,
  enable2FA,
  disable2FA,
  getMe,
  changePassword,
  refreshToken,
  logoutAdmin,
} from '../controllers/authController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', loginLimiter, loginAdmin);
router.post('/verify-2fa', loginLimiter, verify2FA);
router.post('/refresh', refreshToken);
router.post('/logout', logoutAdmin);
router.post('/2fa/generate', protect, requireRole('admin'), generate2FA);
router.post('/2fa/enable', protect, requireRole('admin'), enable2FA);
router.post('/2fa/disable', protect, requireRole('admin'), disable2FA);
router.get('/me', protect, getMe);
router.post('/change-password', protect, requireRole('admin'), changePassword);

export default router;
