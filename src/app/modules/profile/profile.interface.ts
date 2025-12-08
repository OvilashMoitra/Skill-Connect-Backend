import { Types } from 'mongoose';
import { IAuth } from '../auth/auth.interface';

export type IProfile = {
  auth: Types.ObjectId | IAuth;
  name: string;
  imageUrl?: string;
  phoneNumber?: string;
  skill?: string[];
  bio?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
