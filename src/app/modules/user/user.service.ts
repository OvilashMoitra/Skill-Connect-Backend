import { Auth } from '../auth/auth.model';
import { Profile } from '../profile/profile.model';
import { Project } from '../project/project.model';
import { Subscription } from '../subscription/subscription.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createUser = async (data: any) => {
  throw new Error('Use AuthService for user creation');
};

const getAllUsers = async (): Promise<any[]> => {
  const users = await Auth.find().select('-password');
  const populatedUsers = await Promise.all(
    users.map(async (user) => {
      const profile = await Profile.findOne({ auth: user._id });
      return {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: profile?.name || 'Unknown',
        isActive: user.isActive ?? true,
        isBlocked: user.isBlocked ?? false,
        paid: user.paid,
        createdAt: user.createdAt,
      };
    })
  );
  return populatedUsers;
};

const getUserById = async (id: string): Promise<any | null> => {
  const user = await Auth.findById(id).select('-password');
  if (!user) return null;
  const profile = await Profile.findOne({ auth: user._id });
  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    name: profile?.name || 'Unknown',
    isActive: user.isActive ?? true,
    isBlocked: user.isBlocked ?? false,
    paid: user.paid,
    createdAt: user.createdAt,
  };
};

const updateUserRole = async (userId: string, role: string): Promise<any> => {
  const validRoles = ['super_admin', 'project_manager', 'developer'];
  if (!validRoles.includes(role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
  }
  const user = await Auth.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const profile = await Profile.findOne({ auth: user._id });
  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    name: profile?.name || 'Unknown',
    isActive: user.isActive ?? true,
    isBlocked: user.isBlocked ?? false,
    paid: user.paid,
  };
};

const suspendUser = async (userId: string): Promise<any> => {
  const user = await Auth.findByIdAndUpdate(userId, { isActive: false }, { new: true }).select('-password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const profile = await Profile.findOne({ auth: user._id });
  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    name: profile?.name || 'Unknown',
    isActive: user.isActive,
    isBlocked: user.isBlocked ?? false,
    paid: user.paid,
  };
};

const activateUser = async (userId: string): Promise<any> => {
  const user = await Auth.findByIdAndUpdate(userId, { isActive: true }, { new: true }).select('-password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const profile = await Profile.findOne({ auth: user._id });
  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    name: profile?.name || 'Unknown',
    isActive: user.isActive,
    isBlocked: user.isBlocked ?? false,
    paid: user.paid,
  };
};

const blockUser = async (userId: string): Promise<any> => {
  const user = await Auth.findByIdAndUpdate(userId, { isBlocked: true, isActive: false }, { new: true }).select('-password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const profile = await Profile.findOne({ auth: user._id });
  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    name: profile?.name || 'Unknown',
    isActive: user.isActive,
    isBlocked: user.isBlocked,
    paid: user.paid,
  };
};

const unblockUser = async (userId: string): Promise<any> => {
  const user = await Auth.findByIdAndUpdate(userId, { isBlocked: false, isActive: true }, { new: true }).select('-password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const profile = await Profile.findOne({ auth: user._id });
  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    name: profile?.name || 'Unknown',
    isActive: user.isActive,
    isBlocked: user.isBlocked,
    paid: user.paid,
  };
};

const getPlatformAnalytics = async (): Promise<any> => {
  const totalUsers = await Auth.countDocuments();
  const activeUsers = await Auth.countDocuments({ isActive: true, isBlocked: false });
  const blockedUsers = await Auth.countDocuments({ isBlocked: true });
  const premiumUsers = await Auth.countDocuments({ paid: true });
  const totalProjects = await Project.countDocuments();
  const totalSubscriptions = await Subscription.countDocuments();
  
  const usersByRole = await Auth.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ]);

  const recentUsers = await Auth.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const recentUsersWithProfiles = await Promise.all(
    recentUsers.map(async (user) => {
      const profile = await Profile.findOne({ auth: user._id });
      return {
        ...user,
        name: profile?.name || 'Unknown',
      };
    })
  );

  return {
    totalUsers,
    activeUsers,
    blockedUsers,
    premiumUsers,
    totalProjects,
    totalSubscriptions,
    usersByRole,
    recentUsers: recentUsersWithProfiles,
  };
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  suspendUser,
  activateUser,
  blockUser,
  unblockUser,
  getPlatformAnalytics,
};
