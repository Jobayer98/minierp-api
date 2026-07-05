import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../../config/env.js';
import { ROLES, Role } from '../../common/constants/roles.js';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.EMPLOYEE },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, strict: true },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, env.BCRYPT_SALT_ROUNDS);
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
