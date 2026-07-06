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

export const listPermissions = asyncHandler(async (_req: Request, res: Response) => {
  const permissions = roleService.listAvailablePermissions();
  res.status(HTTP.OK).json(new ApiResponse('Available permissions fetched', permissions));
});

export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.createRole(req.body.name, req.body.permissions ?? []);
  res.status(HTTP.CREATED).json(new ApiResponse('Role created successfully', role));
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  await roleService.deleteRole(req.params['name'] as string);
  res.status(HTTP.OK).json(new ApiResponse('Role deleted successfully'));
});

export const replacePermissions = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.replacePermissions(req.params['name'] as string, req.body.permissions);
  res.status(HTTP.OK).json(new ApiResponse('Permissions updated', role));
});

export const addPermission = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.addPermission(req.params['name'] as string, req.body.permission);
  res.status(HTTP.OK).json(new ApiResponse('Permission added', role));
});

export const removePermission = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.removePermission(
    req.params['name'] as string,
    req.params['permission'] as string,
  );
  res.status(HTTP.OK).json(new ApiResponse('Permission removed', role));
});
