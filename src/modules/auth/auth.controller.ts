import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { HTTP } from '../../common/constants/httpStatus.js';
import * as authService from './auth.service.js';

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.status(HTTP.OK).json(new ApiResponse('Login successful', result));
});

export const getMeHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  res.status(HTTP.OK).json(new ApiResponse('User fetched', user));
});
