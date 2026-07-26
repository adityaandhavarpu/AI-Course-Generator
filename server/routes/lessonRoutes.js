import express from 'express';
import { getLessonById, enrichLesson } from '../controllers/lessonController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', protect, getLessonById);
router.post('/:id/enrich', protect, enrichLesson);

export default router;