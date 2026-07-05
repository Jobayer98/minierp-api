import { Role } from './role.model.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { HTTP } from '../../common/constants/httpStatus.js';
import { clearPermissionCache } from '../../middlewares/permission.middleware.js';

export const listRoles = () => Role.find().lean();

export const getRole = async (name: string) => {
  const role = await Role.findOne({ name }).lean();
  if (!role) throw new ApiError(HTTP.NOT_FOUND, `Role "${name}" not found`);
  return role;
};

export const updateRolePermissions = async (name: string, permissions: string[]) => {
  const role = await Role.findOneAndUpdate(
    { name },
    { permissions },
    { new: true, runValidators: true },
  ).lean();
  if (!role) throw new ApiError(HTTP.NOT_FOUND, `Role "${name}" not found`);
  clearPermissionCache(name);
  return role;
};
