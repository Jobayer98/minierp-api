import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { upload } from '../../config/multer.js';
import { ROLES } from '../../common/constants/roles.js';
import { createProductSchema, updateProductSchema } from './product.validation.js';
import * as productController from './product.controller.js';

const router = Router();

const adminManager = [verifyToken, requireRole([ROLES.ADMIN, ROLES.MANAGER])];
const allRoles = [verifyToken];

router.get('/', allRoles, productController.listProducts);
router.get('/:id', allRoles, productController.getProduct);
router.post('/', adminManager, upload.single('image'), validate(createProductSchema), productController.createProduct);
router.patch('/:id', adminManager, upload.single('image'), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', [verifyToken, requireRole([ROLES.ADMIN])], productController.deleteProduct);

export default router;
