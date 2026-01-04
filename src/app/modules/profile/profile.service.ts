import { Profile } from './profile.model';
import { IProfile } from './profile.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Types } from 'mongoose';

const createProfile = async (authId: string, payload: IProfile): Promise<IProfile> => {
  const isExist = await Profile.findOne({ auth: authId });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile already exists');
  }
  payload.auth = authId as any;
  // Set defaults if not provided
  if (!payload.visibility) payload.visibility = 'public';
  if (payload.selectedUsers && payload.selectedUsers.length > 0) {
    payload.selectedUsers = payload.selectedUsers.map((id: any) => new Types.ObjectId(id));
  }
  const result = await Profile.create(payload);
  return result;
};

const getProfile = async (authId: string): Promise<IProfile | null> => {
  const result = await Profile.findOne({ auth: authId }).populate('auth');
  return result;
};

const getPublicProfile = async (profileId: string, requesterId?: string): Promise<IProfile | null> => {
  // Try to find by profile ID first
  let result = await Profile.findById(profileId).populate('auth', 'email role');

  // If not found, try to find by auth ID
  if (!result) {
    result = await Profile.findOne({ auth: profileId }).populate('auth', 'email role');
  }

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }

  // Apply visibility filtering
  const profile = result.toObject();
  
  // If requester is the profile owner, return full profile
  if (requesterId && result.auth && (result.auth as any)._id.toString() === requesterId) {
    return result;
  }

  // Check visibility settings
  if (profile.visibility === 'private') {
    throw new ApiError(httpStatus.FORBIDDEN, 'This profile is private');
  }

  if (profile.visibility === 'selected') {
    const isSelected = profile.selectedUsers?.some(
      (userId: Types.ObjectId) => userId.toString() === requesterId
    );
    if (!isSelected && requesterId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'This profile is only visible to selected users');
    }
    if (!requesterId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Please log in to view this profile');
    }
  }

  // Filter skills based on visibility
  if (!profile.skillsVisibility && profile.skill) {
    profile.skill = profile.skill.filter((skill: any) => skill.isVisible !== false);
  }

  return profile as any;
};

const updateProfile = async (authId: string, payload: Partial<IProfile>): Promise<IProfile | null> => {
  const isExist = await Profile.findOne({ auth: authId });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  
  // Convert selectedUsers strings to ObjectIds if provided
  if (payload.selectedUsers && payload.selectedUsers.length > 0) {
    payload.selectedUsers = payload.selectedUsers.map((id: any) => 
      typeof id === 'string' ? new Types.ObjectId(id) : id
    ) as any;
  }

  const result = await Profile.findOneAndUpdate({ auth: authId }, payload, {
    new: true,
  });
  return result;
};

const searchProfiles = async (query: string, requesterId?: string): Promise<any[]> => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = query.trim().toLowerCase();

  // Build search query - search in skills, name, bio, and category
  const searchQuery = {
    $and: [
      { visibility: { $ne: 'private' } }, // Exclude private profiles
      {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { bio: { $regex: searchTerm, $options: 'i' } },
          { 'skill.name': { $regex: searchTerm, $options: 'i' } },
          { 'skill.category': { $regex: searchTerm, $options: 'i' } },
        ],
      },
    ],
  };

  // Find matching profiles
  const profiles = await Profile.find(searchQuery)
    .populate('auth', 'email role isActive isBlocked')
    .limit(50) // Limit results
    .sort({ averageRating: -1, totalRatings: -1 }); // Sort by rating

  // Filter results based on visibility settings and active/blocked status
  const filteredProfiles = profiles
    .filter((profile) => {
      const authData = profile.auth as any;
      
      // Skip blocked or inactive users
      if (authData?.isBlocked || authData?.isActive === false) {
        return false;
      }

      // If profile is public, include it
      if (profile.visibility === 'public') {
        return true;
      }

      // If profile is selected, check if requester is in selectedUsers
      if (profile.visibility === 'selected' && requesterId) {
        return profile.selectedUsers?.some(
          (userId: Types.ObjectId) => userId.toString() === requesterId
        );
      }

      return false;
    })
    .map((profile) => {
      const profileObj = profile.toObject();
      const authData = profileObj.auth as any;

      // Filter skills that match the search term
      const matchingSkills = profileObj.skill?.filter((skill: any) => {
        if (!profileObj.skillsVisibility) {
          return false; // Skills are hidden
        }
        const skillName = skill.name?.toLowerCase() || '';
        const skillCategory = skill.category?.toLowerCase() || '';
        return (
          skillName.includes(searchTerm) ||
          skillCategory.includes(searchTerm) ||
          skill.isVisible !== false
        );
      });

      return {
        _id: profileObj._id,
        name: profileObj.name,
        imageUrl: profileObj.imageUrl,
        bio: profileObj.bio,
        averageRating: profileObj.averageRating || 0,
        totalRatings: profileObj.totalRatings || 0,
        role: authData?.role,
        email: authData?.email,
        skills: matchingSkills || profileObj.skill || [],
        allSkills: profileObj.skill || [],
        auth: {
          _id: authData?._id,
          role: authData?.role,
        },
      };
    });

  return filteredProfiles;
};

export const ProfileService = {
  createProfile,
  getProfile,
  getPublicProfile,
  updateProfile,
  searchProfiles,
};
