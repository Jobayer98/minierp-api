import { Router } from "express";
import { z } from "zod";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { PERMISSIONS } from "../../common/constants/permissions.js";
import * as roleController from "./role.controller.js";

const guard = [verifyToken, requirePermission(PERMISSIONS.ROLE_MANAGE)];

const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required").toLowerCase(),
  permissions: z.array(z.string().min(1)).optional().default([]),
});

const replacePermissionsSchema = z.object({
  permissions: z
    .array(z.string().min(1))
    .min(1, "At least one permission is required"),
});

const singlePermissionSchema = z.object({
  permission: z.string().min(1, "Permission is required"),
});

const router = Router();

// Available permissions reference
router.get("/permissions", guard, roleController.listPermissions);

// Role CRUD
router.get("/", guard, roleController.listRoles);
router.post("/", guard, validate(createRoleSchema), roleController.createRole);
router.get("/:name", guard, roleController.getRole);
router.delete("/:name", guard, roleController.deleteRole);

// Permission management on a role
router.put(
  "/:name/permissions",
  guard,
  validate(replacePermissionsSchema),
  roleController.replacePermissions,
);
router.post(
  "/:name/permissions",
  guard,
  validate(singlePermissionSchema),
  roleController.addPermission,
);
router.delete(
  "/:name/permissions/:permission",
  guard,
  roleController.removePermission,
);

export default router;
