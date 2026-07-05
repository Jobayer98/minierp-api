import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: string[];
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, lowercase: true, trim: true },
    permissions: [{ type: String, trim: true }],
  },
  { timestamps: true, strict: true },
);

export const Role = mongoose.model<IRole>('Role', roleSchema);
