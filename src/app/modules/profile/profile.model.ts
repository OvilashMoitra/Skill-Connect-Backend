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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Profile: Model<IProfile> = mongoose.model<IProfile>('Profile', ProfileSchema);
