import express from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/image', protect, requireRole('admin'), upload.single('file'), uploadFile);
router.post('/resume', protect, requireRole('admin'), upload.single('file'), uploadFile);

export default router;
