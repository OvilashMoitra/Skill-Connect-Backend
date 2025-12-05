import { Request, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import ApiError from '../../../errors/ApiError';

const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  // Hash password
  const hashedPassword = await bcrypt.hash(password, Number(config.bycrypt_salt_rounds) || 10);
  const user = await UserService.createUser({ name, email, password: hashedPassword, role });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserService.findByEmail(email);
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  const isMatch = await bcrypt.compare(password, user.password || '');
  if (!isMatch) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  const token = jwtHelpers.createToken(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    config.jwt.secret!,
    config.jwt.expires_in || '1d'
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
  });
});

export const AuthController = { register, login };
