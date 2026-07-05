import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { ROLES } from '../../common/constants/roles.js';
import { createCustomerSchema, updateCustomerSchema } from './customer.validation.js';
import * as customerController from './customer.controller.js';

const router = Router();

const adminManager = [verifyToken, requireRole([ROLES.ADMIN, ROLES.MANAGER])];
const adminOnly = [verifyToken, requireRole([ROLES.ADMIN])];

router.get('/', adminManager, customerController.listCustomers);
router.get('/:id', adminManager, customerController.getCustomer);
router.post('/', adminManager, validate(createCustomerSchema), customerController.createCustomer);
router.patch('/:id', adminManager, validate(updateCustomerSchema), customerController.updateCustomer);
router.delete('/:id', adminOnly, customerController.deleteCustomer);

export default router;
