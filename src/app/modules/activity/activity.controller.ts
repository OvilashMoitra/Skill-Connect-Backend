import { Request, Response } from 'express';
import { ActivityService } from './activity.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const getProjectActivity = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { startDate, endDate, action, userId, limit, skip } = req.query;

  const filters = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    action: action as string,
    userId: userId as string,
    limit: limit ? parseInt(limit as string) : undefined,
    skip: skip ? parseInt(skip as string) : undefined,
  };

  const result = await ActivityService.getProjectActivity(projectId, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project activity retrieved successfully',
    data: result,
  });
});

const getUserActivity = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { startDate, endDate, action, limit, skip } = req.query;

  const filters = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    action: action as string,
    limit: limit ? parseInt(limit as string) : undefined,
    skip: skip ? parseInt(skip as string) : undefined,
  };

  const result = await ActivityService.getUserActivity(userId, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User activity retrieved successfully',
    data: result,
  });
});

const getTaskActivity = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { projectId } = req.query;

  const result = await ActivityService.getTaskActivity(taskId, projectId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task activity retrieved successfully',
    data: result,
  });
});

export const ActivityController = {
  getProjectActivity,
  getUserActivity,
  getTaskActivity,
};
