import { Profile } from './profile.model';
import { IProfile } from './profile.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createProfile = async (authId: string, payload: IProfile): Promise<IProfile> => {
  const isExist = await Profile.findOne({ auth: authId });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile already exists');
  }
  payload.auth = authId;
  const result = await Profile.create(payload);
  return result;
};

const getProfile = async (authId: string): Promise<IProfile | null> => {
  const result = await Profile.findOne({ auth: authId }).populate('auth');
  return result;
};

const updateProfile = async (authId: string, payload: Partial<IProfile>): Promise<IProfile | null> => {
  const isExist = await Profile.findOne({ auth: authId });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  const result = await Profile.findOneAndUpdate({ auth: authId }, payload, {
    new: true,
  });
  return result;
};

export const ProfileService = {
  createProfile,
  getProfile,
  updateProfile,
};
