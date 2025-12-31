import { Request, Response } from 'express';
import { TaskService } from './task.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.createTask(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task created successfully',
    data: result,
  });
});

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getAllTasks();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tasks retrieved successfully',
    data: result,
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getTaskById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task retrieved successfully',
    data: result,
  });
});

const logTime = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.logTime(req.params.id, req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Time logged successfully',
    data: result,
  });
});

const addComment = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.addComment(req.params.id, {
    text: req.body.text,
    authorId: req.user!.userId,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment added successfully',
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  const result = await TaskService.updateTask(req.params.id, req.body, userId, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task updated successfully',
    data: result,
  });
});

export const TaskController = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  logTime,
  addComment,
};
