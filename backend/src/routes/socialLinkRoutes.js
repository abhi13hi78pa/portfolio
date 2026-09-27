import express from 'express';
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from '../controllers/socialLinkController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSocialLinks);
router.post('/', protect, requireRole('admin'), createSocialLink);
router.put('/:id', protect, requireRole('admin'), updateSocialLink);
router.delete('/:id', protect, requireRole('admin'), deleteSocialLink);

export default router;
