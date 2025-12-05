import { User, IUser } from './user.model';

const createUser = async (data: IUser): Promise<IUser> => {
  const result = await User.create(data);
  return result;
};

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find();
  return result;
};

const getUserById = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
};
