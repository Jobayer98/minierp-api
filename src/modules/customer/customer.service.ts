import { Customer, ICustomer } from './customer.model.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { HTTP } from '../../common/constants/httpStatus.js';
import { buildQuery, ParsedQuery } from '../../common/utils/queryBuilder.js';

export const listCustomers = (query: ParsedQuery) =>
  buildQuery(Customer, query, {
    searchableFields: ['name', 'phone', 'email'],
    defaultSort: '-createdAt',
  });

export const getCustomer = async (id: string) => {
  const customer = await Customer.findById(id).lean();
  if (!customer) throw new ApiError(HTTP.NOT_FOUND, 'Customer not found');
  return customer;
};

export const createCustomer = async (data: Pick<ICustomer, 'name' | 'phone' | 'email' | 'address'>) => {
  const existing = await Customer.findOne({ phone: data.phone }).lean();
  if (existing) throw new ApiError(HTTP.CONFLICT, `Phone "${data.phone}" already exists`);
  return Customer.create(data);
};

export const updateCustomer = async (id: string, data: Partial<ICustomer>) => {
  if (data.phone) {
    const existing = await Customer.findOne({ phone: data.phone, _id: { $ne: id } }).lean();
    if (existing) throw new ApiError(HTTP.CONFLICT, `Phone "${data.phone}" already exists`);
  }
  const customer = await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  if (!customer) throw new ApiError(HTTP.NOT_FOUND, 'Customer not found');
  return customer;
};

export const deleteCustomer = async (id: string) => {
  const customer = await Customer.findByIdAndDelete(id).lean();
  if (!customer) throw new ApiError(HTTP.NOT_FOUND, 'Customer not found');
};
