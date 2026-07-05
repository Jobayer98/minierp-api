import { Router } from 'express';
import { z } from 'zod';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { requirePermission } from '../../middlewares/permission.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { PERMISSIONS } from '../../common/constants/permissions.js';
import * as roleController from './role.controller.js';

const updatePermissionsSchema = z.object({
  permissions: z.array(z.string().min(1)).min(1, 'At least one permission is required'),
});

const router = Router();

router.get('/', verifyToken, requirePermission(PERMISSIONS.ROLE_MANAGE), roleController.listRoles);
router.get('/:name', verifyToken, requirePermission(PERMISSIONS.ROLE_MANAGE), roleController.getRole);
router.patch('/:name/permissions', verifyToken, requirePermission(PERMISSIONS.ROLE_MANAGE), validate(updatePermissionsSchema), roleController.updateRolePermissions);

export default router;
