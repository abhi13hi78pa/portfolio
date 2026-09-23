import express from 'express';
import {
  getCodingProfiles,
  createCodingProfile,
  updateCodingProfile,
  deleteCodingProfile,
} from '../controllers/codingProfileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCodingProfiles);
router.post('/', protect, createCodingProfile);
router.put('/:id', protect, updateCodingProfile);
router.delete('/:id', protect, deleteCodingProfile);

export default router;
