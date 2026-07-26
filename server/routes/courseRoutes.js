import express from 'express';
import { 
    generateAndSaveCourse, 
    getCourses, 
    getCourseById, 
    deleteCourse 
} from '../controllers/courseController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateAndSaveCourse);
router.get('/', protect, getCourses);
router.get('/:id', protect, getCourseById);
router.delete('/:id', protect, deleteCourse);

export default router;