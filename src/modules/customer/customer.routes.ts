import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { PERMISSIONS } from '../../common/constants/permissions.js';
import { createCustomerSchema, updateCustomerSchema } from './customer.validation.js';
import * as customerController from './customer.controller.js';

const router = Router();

router.get('/',      verifyToken, requirePermission(PERMISSIONS.CUSTOMER_READ),   customerController.listCustomers);
router.get('/:id',   verifyToken, requirePermission(PERMISSIONS.CUSTOMER_READ),   customerController.getCustomer);
router.post('/',     verifyToken, requirePermission(PERMISSIONS.CUSTOMER_CREATE),  validate(createCustomerSchema), customerController.createCustomer);
router.patch('/:id', verifyToken, requirePermission(PERMISSIONS.CUSTOMER_UPDATE),  validate(updateCustomerSchema), customerController.updateCustomer);
router.delete('/:id',verifyToken, requirePermission(PERMISSIONS.CUSTOMER_DELETE),  customerController.deleteCustomer);

export default router;
