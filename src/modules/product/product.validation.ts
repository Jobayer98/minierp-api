import { z } from 'zod';

const productBase = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  purchasePrice: z.coerce.number().min(0, 'Purchase price must be >= 0'),
  sellingPrice: z.coerce.number().min(0, 'Selling price must be >= 0'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock quantity must be >= 0'),
});

export const createProductSchema = productBase;

export const updateProductSchema = productBase
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field is required' });
