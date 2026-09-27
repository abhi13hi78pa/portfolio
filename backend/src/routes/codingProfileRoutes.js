import express from 'express';
import {
  getCodingProfiles,
  createCodingProfile,
  updateCodingProfile,
  deleteCodingProfile,
} from '../controllers/codingProfileController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCodingProfiles);
router.post('/', protect, requireRole('admin'), createCodingProfile);
router.put('/:id', protect, requireRole('admin'), updateCodingProfile);
router.delete('/:id', protect, requireRole('admin'), deleteCodingProfile);

export default router;
