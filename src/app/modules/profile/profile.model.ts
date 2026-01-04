import mongoose, { Schema, Model } from 'mongoose';
import { IProfile, ISkill, ProfileVisibility } from './profile.interface';

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true },
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      required: true,
    },
    category: { type: String, required: true },
    isVisible: { type: Boolean, default: true },
  },
  { _id: false }
);

const ProfileSchema = new Schema<IProfile>(
  {
    auth: { type: Schema.Types.ObjectId, ref: 'Auth', required: true, unique: true },
    name: { type: String, required: true },
    imageUrl: { type: String },
    phoneNumber: { type: String },
    skill: { type: [SkillSchema], default: [] },
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
    visibility: {
      type: String,
      enum: ['public', 'private', 'selected'],
      default: 'public',
    },
    selectedUsers: [{ type: Schema.Types.ObjectId, ref: 'Auth' }],
    skillsVisibility: { type: Boolean, default: true },
    projectsVisibility: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Profile: Model<IProfile> = mongoose.model<IProfile>('Profile', ProfileSchema);
