import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiResponse } from '../../common/utils/ApiResponse.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { HTTP } from '../../common/constants/httpStatus.js';
import { ParsedQuery } from '../../common/utils/queryBuilder.js';
import { uploadImage, deleteImage } from '../../common/utils/uploadImage.js';
import * as productService from './product.service.js';

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await productService.listProducts(req.query as ParsedQuery);
  res.status(HTTP.OK).json(new ApiResponse('Products fetched', data, meta));
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProduct(req.params['id'] as string);
  res.status(HTTP.OK).json(new ApiResponse('Product fetched', product));
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(HTTP.BAD_REQUEST, 'Product image is required');
  const imageUrl = await uploadImage(req.file.buffer, req.file.mimetype);
  const product = await productService.createProduct({ ...req.body, imageUrl });
  res.status(HTTP.CREATED).json(new ApiResponse('Product created successfully', product));
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = { ...req.body };

  if (req.file) {
    const existing = await productService.getProduct(req.params['id'] as string);
    data.imageUrl = await uploadImage(req.file.buffer, req.file.mimetype);
    await deleteImage(existing.imageUrl);
  }

  const product = await productService.updateProduct(req.params['id'] as string, data);
  res.status(HTTP.OK).json(new ApiResponse('Product updated successfully', product));
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const existing = await productService.getProduct(req.params['id'] as string);
  await productService.deleteProduct(req.params['id'] as string);
  await deleteImage(existing.imageUrl);
  res.status(HTTP.OK).json(new ApiResponse('Product deleted successfully'));
});
