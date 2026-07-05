import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { getStats } from './dashboard.controller.js';

const router = Router();

router.get('/stats', verifyToken, getStats);

export default router;
