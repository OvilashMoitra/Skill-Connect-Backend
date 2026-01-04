import { Request, Response } from 'express';
import { RatingService } from './rating.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

const createRating = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const fromUserId = req.user.userId;
  const { toUserId, entityType, entityId, rating, comment } = req.body;

  const result = await RatingService.createRating({
    fromUserId,
    toUserId,
    entityType,
    entityId,
    rating,
    comment,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Rating submitted successfully',
    data: result,
  });
});

const getUserRatings = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { limit, skip } = req.query;

  const options = {
    limit: limit ? parseInt(limit as string) : 50,
    skip: skip ? parseInt(skip as string) : 0,
  };

  const result = await RatingService.getUserRatings(userId, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ratings retrieved successfully',
    data: result,
  });
});

const getRatingsGivenByUser = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const userId = req.user.userId;

  const result = await RatingService.getRatingsGivenByUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ratings given retrieved successfully',
    data: result,
  });
});

const getRatingsReceivedByUser = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const userId = req.user.userId;

  const result = await RatingService.getUserRatings(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Ratings received retrieved successfully',
    data: result,
  });
});

const checkIfRated = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const fromUserId = req.user.userId;
  const { entityType, entityId } = req.params;

  const hasRated = await RatingService.hasUserRated(
    fromUserId,
    entityType as 'task' | 'project',
    entityId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rating status checked',
    data: { hasRated },
  });
});

export const RatingController = {
  createRating,
  getUserRatings,
  getRatingsGivenByUser,
  getRatingsReceivedByUser,
  checkIfRated,
};
