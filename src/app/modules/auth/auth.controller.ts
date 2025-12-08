import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AuthService } from './auth.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.createAuth(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const loginAuth = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginAuth(req.body);
  const { refreshToken, ...others } = result;

  // set refresh token into cookie
  const cookieOptions = {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: others,
  });
});

export const AuthController = {
  createAuth,
  loginAuth,
};
