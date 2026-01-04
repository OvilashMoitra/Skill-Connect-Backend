import { Types } from 'mongoose';
import { IAuth } from '../auth/auth.interface';

export type ISkill = {
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  isVisible?: boolean;
};

export type ProfileVisibility = 'public' | 'private' | 'selected';

export type IProfile = {
  auth: Types.ObjectId | IAuth;
  name: string;
  imageUrl?: string;
  phoneNumber?: string;
  skill?: ISkill[];
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
  visibility?: ProfileVisibility;
  selectedUsers?: Types.ObjectId[];
  skillsVisibility?: boolean;
  projectsVisibility?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
