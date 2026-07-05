import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../modules/user/user.model.js';
import { ROLES } from '../common/constants/roles.js';

const seeds = [
  { name: 'Admin User', email: process.env.SEED_ADMIN_EMAIL!, password: process.env.SEED_ADMIN_PASSWORD!, role: ROLES.ADMIN },
  { name: 'Manager User', email: process.env.SEED_MANAGER_EMAIL!, password: process.env.SEED_MANAGER_PASSWORD!, role: ROLES.MANAGER },
  { name: 'Employee User', email: process.env.SEED_EMPLOYEE_EMAIL!, password: process.env.SEED_EMPLOYEE_PASSWORD!, role: ROLES.EMPLOYEE },
];

const run = async () => {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to DB');

  for (const seed of seeds) {
    const exists = await User.findOne({ email: seed.email });
    if (exists) {
      console.log(`⏭  Skipping ${seed.role} — already exists`);
      continue;
    }
    await User.create(seed);
    console.log(`✅ Created ${seed.role}: ${seed.email}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
