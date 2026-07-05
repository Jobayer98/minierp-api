import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');

export const createSaleSchema = z.object({
  customer: objectId,
  items: z
    .array(
      z.object({
        product: objectId,
        quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
      }),
    )
    .min(1, 'At least one item is required'),
});
