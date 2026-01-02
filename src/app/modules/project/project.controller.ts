import { Request, Response } from 'express';
import { ProjectService } from './project.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createProject = catchAsync(async (req: Request, res: Response) => {
  const projectData = { ...req.body, manager: req.user?.userId }; // Attach logged-in user as manager
  const result = await ProjectService.createProject(projectData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project created successfully',
    data: result,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const { userId, role } = req.user as any;
  const result = await ProjectService.getAllProjects(userId, role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Projects retrieved successfully',
    data: result,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getProjectById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project retrieved successfully',
    data: result,
  });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.getDashboardStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard stats retrieved successfully',
    data: result,
  });
});

const addTeamMember = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.addTeamMember(req.params.id, req.body.userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Team member added successfully',
    data: result,
  });
});

export const ProjectController = {
  createProject,
  getAllProjects,
  getProjectById,
  getDashboardStats,
  addTeamMember,
};
