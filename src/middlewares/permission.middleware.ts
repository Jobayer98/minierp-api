import { Request, Response, NextFunction } from 'express';
import { Role } from '../modules/role/role.model.js';
import { ApiError } from '../common/utils/ApiError.js';
import { HTTP } from '../common/constants/httpStatus.js';
import { Permission } from '../common/constants/permissions.js';

// Simple in-process cache — invalidated on role update
const cache = new Map<string, string[]>();

export const clearPermissionCache = (roleName?: string) => {
  if (roleName) cache.delete(roleName);
  else cache.clear();
};

const getPermissions = async (roleName: string): Promise<string[]> => {
  if (cache.has(roleName)) return cache.get(roleName)!;
  const role = await Role.findOne({ name: roleName }).lean();
  const permissions = role?.permissions ?? [];
  cache.set(roleName, permissions);
  return permissions;
};

export const requirePermission =
  (permission: Permission) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) return next(new ApiError(HTTP.UNAUTHORIZED, 'Not authenticated'));
      const permissions = await getPermissions(req.user.role);
      if (!permissions.includes(permission)) {
        return next(new ApiError(HTTP.FORBIDDEN, 'Insufficient permissions'));
      }
      next();
    } catch {
      next(new ApiError(HTTP.INTERNAL, 'Permission check failed'));
    }
  };
