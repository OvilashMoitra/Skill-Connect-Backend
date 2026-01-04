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
  averageRating?: number;
  totalRatings?: number;
  ratingsBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
};
