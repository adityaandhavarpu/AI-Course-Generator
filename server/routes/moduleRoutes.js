import express from 'express';
import { getModuleById } from '../controllers/moduleController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', protect, getModuleById);

export default router;