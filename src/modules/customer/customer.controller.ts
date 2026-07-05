import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { HTTP } from '../../common/constants/httpStatus.js';
import { ParsedQuery } from '../../common/utils/queryBuilder.js';
import * as customerService from './customer.service.js';

export const listCustomers = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await customerService.listCustomers(req.query as ParsedQuery);
  res.status(HTTP.OK).json(new ApiResponse('Customers fetched', data, meta));
});

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.getCustomer(req.params['id'] as string);
  res.status(HTTP.OK).json(new ApiResponse('Customer fetched', customer));
});

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.createCustomer(req.body);
  res.status(HTTP.CREATED).json(new ApiResponse('Customer created successfully', customer));
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.updateCustomer(req.params['id'] as string, req.body);
  res.status(HTTP.OK).json(new ApiResponse('Customer updated successfully', customer));
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  await customerService.deleteCustomer(req.params['id'] as string);
  res.status(HTTP.OK).json(new ApiResponse('Customer deleted successfully'));
});
