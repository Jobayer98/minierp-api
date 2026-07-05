import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { HTTP } from '../../common/constants/httpStatus.js';
import * as dashboardService from './dashboard.service.js';

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await dashboardService.getDashboardStats();
  res.status(HTTP.OK).json(new ApiResponse('Dashboard stats fetched', stats));
});
