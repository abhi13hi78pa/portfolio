import express from 'express';
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} from '../controllers/certificationController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCertifications);
router.post('/', protect, requireRole('admin'), createCertification);
router.put('/:id', protect, requireRole('admin'), updateCertification);
router.delete('/:id', protect, requireRole('admin'), deleteCertification);

export default router;
