import { Auth } from '../auth/auth.model';
import { Profile } from '../profile/profile.model';

const createUser = async (data: any) => {
  throw new Error('Use AuthService for user creation');
};

const getAllUsers = async (): Promise<any[]> => {
  const users = await Auth.find();
  const populatedUsers = await Promise.all(
    users.map(async (user) => {
      const profile = await Profile.findOne({ auth: user._id });
      return {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: profile?.name || 'Unknown',
      };
    })
  );
  return populatedUsers;
};

const getUserById = async (id: string): Promise<any | null> => {
  const user = await Auth.findById(id);
  if (!user) return null;
  const profile = await Profile.findOne({ auth: user._id });
  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    name: profile?.name || 'Unknown',
  };
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
};
