import mongoose, { Schema, Model } from 'mongoose';
import { IProfile } from './profile.interface';

const ProfileSchema = new Schema<IProfile>(
  {
    auth: { type: Schema.Types.ObjectId, ref: 'Auth', required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: { type: String },
    phoneNumber: { type: String },
    skill: { type: [String] },
    bio: { type: String },
    address: { type: String },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    ratingsBreakdown: {
      type: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 },
      },
      default: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Profile: Model<IProfile> = mongoose.model<IProfile>('Profile', ProfileSchema);
