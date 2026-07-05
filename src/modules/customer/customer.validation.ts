import { z } from 'zod';

const customerBase = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email address').optional(),
  address: z.string().optional(),
});

export const createCustomerSchema = customerBase;

export const updateCustomerSchema = customerBase
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field is required' });
