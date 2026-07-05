import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { PERMISSIONS } from '../../common/constants/permissions.js';
import { createSaleSchema } from './sales.validation.js';
import * as salesController from './sales.controller.js';

const router = Router();

router.get('/',    verifyToken, requirePermission(PERMISSIONS.SALE_READ),   salesController.listSales);
router.get('/:id', verifyToken, requirePermission(PERMISSIONS.SALE_READ),   salesController.getSale);
router.post('/',   verifyToken, requirePermission(PERMISSIONS.SALE_CREATE),  validate(createSaleSchema), salesController.createSale);

export default router;
