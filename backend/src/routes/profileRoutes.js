import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProfile);
router.put('/', protect, requireRole('admin'), updateProfile);

export default router;
