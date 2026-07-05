import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createSaleSchema } from './sales.validation.js';
import * as salesController from './sales.controller.js';

const router = Router();

router.get('/', verifyToken, salesController.listSales);
router.get('/:id', verifyToken, salesController.getSale);
router.post('/', verifyToken, validate(createSaleSchema), salesController.createSale);

export default router;
