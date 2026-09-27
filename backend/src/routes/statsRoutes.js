import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, requireRole('admin'), getDashboardStats);

export default router;
