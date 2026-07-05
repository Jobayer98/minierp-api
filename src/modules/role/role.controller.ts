import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { HTTP } from '../../common/constants/httpStatus.js';
import * as roleService from './role.service.js';

export const listRoles = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await roleService.listRoles();
  res.status(HTTP.OK).json(new ApiResponse('Roles fetched', roles));
});

export const getRole = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.getRole(req.params['name'] as string);
  res.status(HTTP.OK).json(new ApiResponse('Role fetched', role));
});

export const updateRolePermissions = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.updateRolePermissions(
    req.params['name'] as string,
    req.body.permissions,
  );
  res.status(HTTP.OK).json(new ApiResponse('Role permissions updated', role));
});
