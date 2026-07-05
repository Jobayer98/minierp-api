import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../modules/user/user.model.js';
import { Product } from '../modules/product/product.model.js';
import { Customer } from '../modules/customer/customer.model.js';
import { Sale } from '../modules/sales/sales.model.js';
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

const customerSeeds = [
  { name: 'Acme Corp', phone: '+1-555-0101', email: 'contact@acmecorp.com', address: '123 Main St, Springfield, IL 62701' },
  { name: 'Globex Industries', phone: '+1-555-0102', email: 'info@globex.com', address: '742 Evergreen Terrace, Springfield, IL 62702' },
  { name: 'Initech Solutions', phone: '+1-555-0103', email: 'hello@initech.com', address: '4 Privet Drive, Austin, TX 73301' },
  { name: 'Umbrella Ltd', phone: '+1-555-0104', email: 'sales@umbrella.com', address: '99 Raccoon Ave, Raccoon City, MO 63101' },
  { name: 'Stark Supplies', phone: '+1-555-0105', email: 'orders@starksupplies.com', address: '10880 Malibu Point, Malibu, CA 90265' },
  { name: 'Wayne Enterprises', phone: '+1-555-0106', email: 'procurement@wayne.com', address: '1007 Mountain Drive, Gotham, NJ 07001' },
  { name: 'Dunder Mifflin', phone: '+1-555-0107', email: 'michael@dundermifflin.com', address: '1725 Slough Ave, Scranton, PA 18503' },
  { name: 'Pied Piper Inc', phone: '+1-555-0108', email: 'richard@piedpiper.com', address: '5230 Newell Rd, Palo Alto, CA 94303' },
  { name: 'Hooli Corp', phone: '+1-555-0109', email: 'gavin@hooli.com', address: '1 Hooli Way, San Francisco, CA 94105' },
  { name: 'Vandelay Industries', phone: '+1-555-0110', email: 'art@vandelay.com', address: '129 W 81st St, New York, NY 10024' },
];

// ── Provided IDs ─────────────────────────────────────────────────────────────
const C = {
  acme:    new Types.ObjectId('6a4aae3469c71be699a06761'),
  globex:  new Types.ObjectId('6a4aae3469c71be699a06760'),
  initech: new Types.ObjectId('6a4aae3469c71be699a0675f'),
  umbrella:new Types.ObjectId('6a4aae3469c71be699a0675e'),
};

const P = {
  p1: new Types.ObjectId('6a4aa9eb5483538c0d7704c3'),
  p2: new Types.ObjectId('6a4aa4a1ea66e7e1e912c602'),
  p3: new Types.ObjectId('6a4aa2ce8ea754fbcbd2a79b'),
  p4: new Types.ObjectId('6a4aa2cd8ea754fbcbd2a79a'),
  p5: new Types.ObjectId('6a4aa2cd8ea754fbcbd2a799'),
};

const makeSale = (
  customer: Types.ObjectId,
  createdBy: Types.ObjectId,
  items: { product: Types.ObjectId; productName: string; quantity: number; unitPrice: number }[],
) => {
  const enriched = items.map((i) => ({ ...i, subtotal: +(i.unitPrice * i.quantity).toFixed(2) }));
  const grandTotal = +enriched.reduce((s, i) => s + i.subtotal, 0).toFixed(2);
  return { customer, items: enriched, grandTotal, createdBy };
};

const buildSaleSeeds = (adminId: Types.ObjectId) => [
  makeSale(C.acme, adminId, [
    { product: P.p1, productName: 'Wireless Mouse', quantity: 3, unitPrice: 24.99 },
    { product: P.p2, productName: 'Mechanical Keyboard', quantity: 1, unitPrice: 89.99 },
  ]),
  makeSale(C.globex, adminId, [
    { product: P.p3, productName: 'USB-C Hub 7-in-1', quantity: 2, unitPrice: 39.99 },
    { product: P.p4, productName: 'HD Webcam 1080p', quantity: 1, unitPrice: 59.99 },
  ]),
  makeSale(C.initech, adminId, [
    { product: P.p5, productName: 'Noise Cancelling Headphones', quantity: 2, unitPrice: 119.99 },
  ]),
  makeSale(C.umbrella, adminId, [
    { product: P.p1, productName: 'Wireless Mouse', quantity: 5, unitPrice: 24.99 },
    { product: P.p3, productName: 'USB-C Hub 7-in-1', quantity: 3, unitPrice: 39.99 },
    { product: P.p5, productName: 'Noise Cancelling Headphones', quantity: 1, unitPrice: 119.99 },
  ]),
  makeSale(C.acme, adminId, [
    { product: P.p2, productName: 'Mechanical Keyboard', quantity: 2, unitPrice: 89.99 },
    { product: P.p4, productName: 'HD Webcam 1080p', quantity: 2, unitPrice: 59.99 },
  ]),
  makeSale(C.globex, adminId, [
    { product: P.p1, productName: 'Wireless Mouse', quantity: 10, unitPrice: 24.99 },
  ]),
  makeSale(C.initech, adminId, [
    { product: P.p4, productName: 'HD Webcam 1080p', quantity: 1, unitPrice: 59.99 },
    { product: P.p5, productName: 'Noise Cancelling Headphones', quantity: 1, unitPrice: 119.99 },
  ]),
  makeSale(C.umbrella, adminId, [
    { product: P.p2, productName: 'Mechanical Keyboard', quantity: 3, unitPrice: 89.99 },
  ]),
];

// ── Seeders ───────────────────────────────────────────────────────────────────
const seedUsers = async () => {
  for (const seed of userSeeds) {
    const exists = await User.findOne({ email: seed.email });
    if (exists) { console.log(`⏭  Skipping ${seed.role} — already exists`); continue; }
    await User.create(seed);
    console.log(`✅ Created ${seed.role}: ${seed.email}`);
  }
};

const seedProducts = async () => {
  for (const seed of productSeeds) {
    const exists = await Product.findOne({ sku: seed.sku });
    if (exists) { console.log(`⏭  Skipping product ${seed.sku} — already exists`); continue; }
    await Product.create(seed);
    console.log(`✅ Created product: ${seed.name} (${seed.sku})`);
  }
};

const seedCustomers = async () => {
  for (const seed of customerSeeds) {
    const exists = await Customer.findOne({ phone: seed.phone });
    if (exists) { console.log(`⏭  Skipping customer ${seed.name} — already exists`); continue; }
    await Customer.create(seed);
    console.log(`✅ Created customer: ${seed.name}`);
  }
};

const seedSales = async () => {
  const admin = await User.findOne({ role: ROLES.ADMIN }).lean();
  if (!admin) { console.log('⚠️  No admin user found — skipping sales seed'); return; }

  const existing = await Sale.countDocuments();
  if (existing > 0) { console.log(`⏭  Skipping sales — ${existing} sale(s) already exist`); return; }

  const seeds = buildSaleSeeds(admin._id as Types.ObjectId);
  await Sale.insertMany(seeds);
  console.log(`✅ Created ${seeds.length} sales`);
};

// ── Run ───────────────────────────────────────────────────────────────────────
const run = async () => {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to DB\n');

  console.log('--- Users ---');
  await seedUsers();

  console.log('\n--- Products ---');
  await seedProducts();

  console.log('\n--- Customers ---');
  await seedCustomers();

  console.log('\n--- Sales ---');
  await seedSales();

  await mongoose.disconnect();
  console.log('\nDone.');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
