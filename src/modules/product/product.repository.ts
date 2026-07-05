import { Product, IProduct } from './product.model.js';
import { buildQuery, ParsedQuery } from '../../common/utils/queryBuilder.js';

export const findProducts = (query: ParsedQuery) =>
  buildQuery(Product, query, {
    searchableFields: ['name', 'sku'],
    filterableFields: ['category', 'isActive'],
    defaultSort: '-createdAt',
  });

export const findProductById = (id: string) =>
  Product.findOne({ _id: id, isActive: true }).lean();

export const findProductBySku = (sku: string) =>
  Product.findOne({ sku: sku.toUpperCase() }).lean();

export const createProduct = (data: Partial<IProduct>) =>
  Product.create(data);

export const updateProductById = (id: string, data: Partial<IProduct>) =>
  Product.findOneAndUpdate({ _id: id, isActive: true }, data, { new: true, runValidators: true }).lean();

export const softDeleteProduct = (id: string) =>
  Product.findOneAndUpdate({ _id: id, isActive: true }, { isActive: false }, { new: true }).lean();
