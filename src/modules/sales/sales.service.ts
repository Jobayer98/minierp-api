import mongoose from 'mongoose';
import { Sale } from './sales.model.js';
import { Product } from '../product/product.model.js';
import { Customer } from '../customer/customer.model.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { HTTP } from '../../common/constants/httpStatus.js';
import { buildQuery, ParsedQuery } from '../../common/utils/queryBuilder.js';

interface SaleItemInput {
  product: string;
  quantity: number;
}

interface CreateSaleInput {
  customer: string;
  items: SaleItemInput[];
  createdBy: string;
}

export const listSales = (query: ParsedQuery) =>
  buildQuery(Sale, query, { defaultSort: '-createdAt' });

export const getSale = async (id: string) => {
  const sale = await Sale.findById(id)
    .populate('customer', 'name phone email')
    .populate('createdBy', 'name role')
    .lean();
  if (!sale) throw new ApiError(HTTP.NOT_FOUND, 'Sale not found');
  return sale;
};

export const createSale = async ({ customer, items, createdBy }: CreateSaleInput) => {
  // 1. Validate customer exists
  const customerDoc = await Customer.findById(customer).lean();
  if (!customerDoc) throw new ApiError(HTTP.NOT_FOUND, 'Customer not found');

  // 2. Fetch all products and validate stock
  const saleItems = await Promise.all(
    items.map(async ({ product, quantity }) => {
      const doc = await Product.findOne({ _id: product, isActive: true }).lean();
      if (!doc) throw new ApiError(HTTP.NOT_FOUND, `Product "${product}" not found`);
      if (doc.stockQuantity < quantity) {
        throw new ApiError(
          HTTP.BAD_REQUEST,
          `Insufficient stock for SKU "${doc.sku}" — only ${doc.stockQuantity} unit(s) available`,
          [{ field: 'quantity', message: `Only ${doc.stockQuantity} units available` }],
        );
      }
      return {
        product: doc._id,
        productName: doc.name,
        quantity,
        unitPrice: doc.sellingPrice,
        subtotal: doc.sellingPrice * quantity,
      };
    }),
  );

  const grandTotal = saleItems.reduce((sum, item) => sum + item.subtotal, 0);

  // 3. Transaction — atomic stock decrement + sale insert
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of saleItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
        { session, new: true },
      );
      if (!updated) {
        throw new ApiError(HTTP.BAD_REQUEST, `Stock changed during transaction for product "${item.productName}"`);
      }
    }

    const [sale] = await Sale.create(
      [{ customer, items: saleItems, grandTotal, createdBy }],
      { session },
    );

    await session.commitTransaction();

    return Sale.findById(sale._id)
      .populate('customer', 'name phone email')
      .populate('createdBy', 'name role')
      .lean();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
