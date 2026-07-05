import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../modules/user/user.model.js';
import { Product } from '../modules/product/product.model.js';
import { ROLES } from '../common/constants/roles.js';

const userSeeds = [
  { name: 'Admin User', email: process.env.SEED_ADMIN_EMAIL!, password: process.env.SEED_ADMIN_PASSWORD!, role: ROLES.ADMIN },
  { name: 'Manager User', email: process.env.SEED_MANAGER_EMAIL!, password: process.env.SEED_MANAGER_PASSWORD!, role: ROLES.MANAGER },
  { name: 'Employee User', email: process.env.SEED_EMPLOYEE_EMAIL!, password: process.env.SEED_EMPLOYEE_PASSWORD!, role: ROLES.EMPLOYEE },
];

const productSeeds = [
  { name: 'Wireless Mouse', sku: 'WM-1001', category: 'Electronics', purchasePrice: 12.50, sellingPrice: 24.99, stockQuantity: 150, imageUrl: '/uploads/placeholder.jpg' },
  { name: 'Mechanical Keyboard', sku: 'KB-2001', category: 'Electronics', purchasePrice: 45.00, sellingPrice: 89.99, stockQuantity: 80, imageUrl: '/uploads/placeholder.jpg' },
  { name: 'USB-C Hub 7-in-1', sku: 'USB-3001', category: 'Electronics', purchasePrice: 18.00, sellingPrice: 39.99, stockQuantity: 4, imageUrl: '/uploads/placeholder.jpg' },
  { name: 'HD Webcam 1080p', sku: 'CAM-4001', category: 'Electronics', purchasePrice: 30.00, sellingPrice: 59.99, stockQuantity: 60, imageUrl: '/uploads/placeholder.jpg' },
  { name: 'Noise Cancelling Headphones', sku: 'HP-5001', category: 'Audio', purchasePrice: 55.00, sellingPrice: 119.99, stockQuantity: 45, imageUrl: '/uploads/placeholder.jpg' },
  { name: 'Bluetooth Speaker', sku: 'SPK-6001', category: 'Audio', purchasePrice: 22.00, sellingPrice: 49.99, stockQuantity: 3, imageUrl: '/uploads/placeholder.jpg' },
  { name: 'Laptop Stand Adjustable', sku: 'LS-7001', category: 'Accessories', purchasePrice: 15.00, sellingPrice: 34.99, stockQuantity: 120, imageUrl: '/uploads/placeholder.jpg' },
  { name: 'Desk Lamp LED', sku: 'DL-8001', category: 'Office', purchasePrice: 10.00, sellingPrice: 22.99, stockQuantity: 2, imageUrl: '/uploads/placeholder.jpg' },
  { name: 'Ergonomic Mouse Pad', sku: 'MP-9001', category: 'Accessories', purchasePrice: 8.00, sellingPrice: 17.99, stockQuantity: 200, imageUrl: '/uploads/placeholder.jpg' },
  { name: 'HDMI Cable 2m', sku: 'HDMI-0001', category: 'Cables', purchasePrice: 4.00, sellingPrice: 9.99, stockQuantity: 1, imageUrl: '/uploads/placeholder.jpg' },
];

const seedUsers = async () => {
  for (const seed of userSeeds) {
    const exists = await User.findOne({ email: seed.email });
    if (exists) {
      console.log(`⏭  Skipping ${seed.role} — already exists`);
      continue;
    }
    await User.create(seed);
    console.log(`✅ Created ${seed.role}: ${seed.email}`);
  }
};

const seedProducts = async () => {
  for (const seed of productSeeds) {
    const exists = await Product.findOne({ sku: seed.sku });
    if (exists) {
      console.log(`⏭  Skipping product ${seed.sku} — already exists`);
      continue;
    }
    await Product.create(seed);
    console.log(`✅ Created product: ${seed.name} (${seed.sku})`);
  }
};

const run = async () => {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to DB\n');

  console.log('--- Users ---');
  await seedUsers();

  console.log('\n--- Products ---');
  await seedProducts();

  await mongoose.disconnect();
  console.log('\nDone.');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
