import { Role } from './role.model.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { HTTP } from '../../common/constants/httpStatus.js';
import { clearPermissionCache } from '../../middlewares/permission.middleware.js';
import { PERMISSIONS } from '../../common/constants/permissions.js';

export const listRoles = () => Role.find().select('-__v').lean();

export const getRole = async (name: string) => {
  const role = await Role.findOne({ name }).select('-__v').lean();
  if (!role) throw new ApiError(HTTP.NOT_FOUND, `Role "${name}" not found`);
  return role;
};

export const listAvailablePermissions = () => {
  const grouped: Record<string, string[]> = {};
  for (const value of Object.values(PERMISSIONS)) {
    const [group] = value.split(':');
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(value);
  }
  return grouped;
};

export const createRole = async (name: string, permissions: string[]) => {
  const exists = await Role.findOne({ name }).lean();
  if (exists) throw new ApiError(HTTP.CONFLICT, `Role "${name}" already exists`);
  return Role.create({ name, permissions });
};

export const deleteRole = async (name: string) => {
  const protected_ = ['admin', 'manager', 'employee'];
  if (protected_.includes(name)) {
    throw new ApiError(HTTP.BAD_REQUEST, `Cannot delete built-in role "${name}"`);
  }
  const role = await Role.findOneAndDelete({ name }).lean();
  if (!role) throw new ApiError(HTTP.NOT_FOUND, `Role "${name}" not found`);
  clearPermissionCache(name);
};

export const replacePermissions = async (name: string, permissions: string[]) => {
  const role = await Role.findOneAndUpdate(
    { name },
    { permissions },
    { new: true, runValidators: true },
  ).select('-__v').lean();
  if (!role) throw new ApiError(HTTP.NOT_FOUND, `Role "${name}" not found`);
  clearPermissionCache(name);
  return role;
};

export const addPermission = async (name: string, permission: string) => {
  const role = await Role.findOneAndUpdate(
    { name },
    { $addToSet: { permissions: permission } },
    { new: true },
  ).select('-__v').lean();
  if (!role) throw new ApiError(HTTP.NOT_FOUND, `Role "${name}" not found`);
  clearPermissionCache(name);
  return role;
};

export const removePermission = async (name: string, permission: string) => {
  const role = await Role.findOneAndUpdate(
    { name },
    { $pull: { permissions: permission } },
    { new: true },
  ).select('-__v').lean();
  if (!role) throw new ApiError(HTTP.NOT_FOUND, `Role "${name}" not found`);
  clearPermissionCache(name);
  return role;
};
