import express from 'express';
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from '../controllers/socialLinkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSocialLinks);
router.post('/', protect, createSocialLink);
router.put('/:id', protect, updateSocialLink);
router.delete('/:id', protect, deleteSocialLink);

export default router;
