import * as repo from './product.repository.js';
import { ParsedQuery } from '../../common/utils/queryBuilder.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { HTTP } from '../../common/constants/httpStatus.js';

interface CreateProductData {
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  imageUrl: string;
}

interface UpdateProductData {
  name?: string;
  category?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  stockQuantity?: number;
  imageUrl?: string;
}

export const listProducts = (query: ParsedQuery) => repo.findProducts(query);

export const getProduct = async (id: string) => {
  const product = await repo.findProductById(id);
  if (!product) throw new ApiError(HTTP.NOT_FOUND, 'Product not found');
  return product;
};

export const createProduct = async (data: CreateProductData) => {
  const existing = await repo.findProductBySku(data.sku);
  if (existing) throw new ApiError(HTTP.CONFLICT, `SKU "${data.sku.toUpperCase()}" already exists`);
  return repo.createProduct(data);
};

export const updateProduct = async (id: string, data: UpdateProductData) => {
  const product = await repo.updateProductById(id, data);
  if (!product) throw new ApiError(HTTP.NOT_FOUND, 'Product not found');
  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await repo.softDeleteProduct(id);
  if (!product) throw new ApiError(HTTP.NOT_FOUND, 'Product not found');
};
