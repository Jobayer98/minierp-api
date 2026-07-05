import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { HTTP } from '../../common/constants/httpStatus.js';
import { ParsedQuery } from '../../common/utils/queryBuilder.js';
import * as salesService from './sales.service.js';

export const listSales = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await salesService.listSales(req.query as ParsedQuery);
  res.status(HTTP.OK).json(new ApiResponse('Sales fetched', data, meta));
});

export const getSale = asyncHandler(async (req: Request, res: Response) => {
  const sale = await salesService.getSale(req.params['id'] as string);
  res.status(HTTP.OK).json(new ApiResponse('Sale fetched', sale));
});

export const createSale = asyncHandler(async (req: Request, res: Response) => {
  const sale = await salesService.createSale({
    ...req.body,
    createdBy: req.user!.id,
  });
  res.status(HTTP.CREATED).json(new ApiResponse('Sale created successfully', sale));
});
