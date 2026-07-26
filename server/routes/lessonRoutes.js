import express from 'express';
import { getLessonById } from '../controllers/lessonController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', protect, getLessonById);

export default router;