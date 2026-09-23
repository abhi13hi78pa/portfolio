import express from 'express';
import {
  loginAdmin,
  verify2FA,
  generate2FA,
  enable2FA,
  disable2FA,
  getMe,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', loginLimiter, loginAdmin);
router.post('/verify-2fa', loginLimiter, verify2FA);
router.post('/2fa/generate', protect, generate2FA);
router.post('/2fa/enable', protect, enable2FA);
router.post('/2fa/disable', protect, disable2FA);
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);

export default router;
