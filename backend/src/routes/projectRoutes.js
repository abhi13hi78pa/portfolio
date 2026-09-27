import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from '../controllers/projectController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', protect, requireRole('admin'), createProject);
router.put('/reorder', protect, requireRole('admin'), reorderProjects);
router.put('/:id', protect, requireRole('admin'), updateProject);
router.delete('/:id', protect, requireRole('admin'), deleteProject);

export default router;
