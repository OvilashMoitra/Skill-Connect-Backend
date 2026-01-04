import mongoose, { Schema, Model } from 'mongoose';
import { IAuth, IAuthRole } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const AuthSchema = new Schema<IAuth>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    role: {
      type: String,
      enum: ['super_admin', 'project_manager', 'developer'],
      required: true,
    },
    paid: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);



export const Auth: Model<IAuth> = mongoose.model<IAuth>('Auth', AuthSchema);
