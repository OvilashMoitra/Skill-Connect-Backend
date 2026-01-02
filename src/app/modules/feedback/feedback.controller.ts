import { Request, Response } from 'express';
import { FeedbackService } from './feedback.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createFeedback = catchAsync(async (req: Request, res: Response) => {
  const result = await FeedbackService.createFeedback(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedback submitted successfully',
    data: result,
  });
});

const getFeedbacks = catchAsync(async (req: Request, res: Response) => {
  const result = await FeedbackService.getFeedbacks(req.params.projectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Feedbacks retrieved successfully',
    data: result,
  });
});

export const FeedbackController = {
  createFeedback,
  getFeedbacks,
};
