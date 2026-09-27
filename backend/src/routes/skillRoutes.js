import express from 'express';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} from '../controllers/skillController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSkills);
router.post('/', protect, requireRole('admin'), createSkill);
router.put('/reorder', protect, requireRole('admin'), reorderSkills);
router.put('/:id', protect, requireRole('admin'), updateSkill);
router.delete('/:id', protect, requireRole('admin'), deleteSkill);

export default router;
