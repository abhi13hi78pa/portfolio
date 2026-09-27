import express from 'express';
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getExperience);
router.post('/', protect, requireRole('admin'), createExperience);
router.put('/:id', protect, requireRole('admin'), updateExperience);
router.delete('/:id', protect, requireRole('admin'), deleteExperience);

export default router;
