import { Product } from '../product/product.model.js';
import { Customer } from '../customer/customer.model.js';
import { Sale } from '../sales/sales.model.js';

const LOW_STOCK_THRESHOLD = 5;

export const getDashboardStats = async () => {
  const [totalProducts, totalCustomers, totalSales, lowStockProducts] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Customer.countDocuments(),
    Sale.countDocuments(),
    Product.find({ stockQuantity: { $lt: LOW_STOCK_THRESHOLD }, isActive: true })
      .select('name sku stockQuantity')
      .sort('stockQuantity')
      .lean(),
  ]);

  return { totalProducts, totalCustomers, totalSales, lowStockProducts };
};
