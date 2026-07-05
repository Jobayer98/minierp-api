import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';
import { PERMISSIONS } from '../../common/constants/permissions.js';
import { getStats } from './dashboard.controller.js';

const router = Router();

router.get('/stats', verifyToken, requirePermission(PERMISSIONS.DASHBOARD_READ), getStats);

export default router;
