import httpStatus from 'http-status';
import { Auth } from './auth.model';
import { IAuth } from './auth.interface';
import ApiError from '../../../errors/ApiError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config';

const createAuth = async (payload: IAuth): Promise<IAuth | null> => {
  const isEmailExist = await Auth.findOne({ email: payload.email });
  if (isEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
  }

  // hashing password

 
  const encryptedpassword = await bcrypt.hash(
    payload.password!,
    Number(config.bycrypt_salt_rounds)
  );
  payload.password = encryptedpassword;
  const result = await Auth.create(payload);
  const { password, ...authData } = result.toObject();
  return authData as IAuth;
};

const loginAuth = async (payload: IAuth): Promise<{ accessToken: string; refreshToken: string; user: any }> => {
  const { email, password } = payload;
  const isUserExist = await Auth.findOne({ email }, { email: 1, password: 1, role: 1 });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password does not match');
  }

  const { _id, role } = isUserExist;

  const accessToken = jwt.sign(
    { userId: _id, role },
    config.jwt.secret as string,
    { expiresIn: config.jwt.expires_in }
  );

  const refreshToken = jwt.sign(
    { userId: _id, role },
    config.jwt.refresh_secret as string,
    { expiresIn: config.jwt.refresh_expires_in }
  );

  // Fetch profile to get name
  // We need to import Profile model. 
  // Since we are in Auth module, we might need to import it.
  // Ideally this should be decoupled, but for speed:
  const profile = await import('../profile/profile.model').then(m => m.Profile.findOne({ auth: _id }));

  return {
    accessToken,
    refreshToken,
    user: {
      _id: isUserExist._id,
      email: isUserExist.email,
      role: isUserExist.role,
      name: profile?.name || 'Unknown',
    }
  };
};

export const AuthService = {
  createAuth,
  loginAuth,
};
