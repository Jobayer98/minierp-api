import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { upload } from '../../config/multer.js';
import { PERMISSIONS } from '../../common/constants/permissions.js';
import { createProductSchema, updateProductSchema } from './product.validation.js';
import * as productController from './product.controller.js';

const router = Router();

router.get('/',     verifyToken, requirePermission(PERMISSIONS.PRODUCT_READ),   productController.listProducts);
router.get('/:id',  verifyToken, requirePermission(PERMISSIONS.PRODUCT_READ),   productController.getProduct);
router.post('/',    verifyToken, requirePermission(PERMISSIONS.PRODUCT_CREATE),  upload.single('image'), validate(createProductSchema), productController.createProduct);
router.patch('/:id',verifyToken, requirePermission(PERMISSIONS.PRODUCT_UPDATE),  upload.single('image'), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id',verifyToken,requirePermission(PERMISSIONS.PRODUCT_DELETE),  productController.deleteProduct);

export default router;
