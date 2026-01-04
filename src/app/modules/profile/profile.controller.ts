import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ProfileService } from './profile.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as any;
  const result = await ProfileService.createProfile(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile created successfully',
    data: result,
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as any;
  const result = await ProfileService.getProfile(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const getPublicProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await ProfileService.getPublicProfile(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Public profile retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as any;
  const result = await ProfileService.updateProfile(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

export const ProfileController = {
  createProfile,
  getProfile,
  getPublicProfile,
  updateProfile,
};
