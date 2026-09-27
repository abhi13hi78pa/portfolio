import express from 'express';
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEducation);
router.post('/', protect, requireRole('admin'), createEducation);
router.put('/:id', protect, requireRole('admin'), updateEducation);
router.delete('/:id', protect, requireRole('admin'), deleteEducation);

export default router;
