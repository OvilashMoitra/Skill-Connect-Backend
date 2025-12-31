import { Request, Response } from 'express';
import { ProjectService } from '../project/project.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createMilestone = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const milestoneData = req.body;

  const result = await ProjectService.addMilestone(projectId, milestoneData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Milestone created successfully',
    data: result,
  });
});

const getMilestones = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  const result = await ProjectService.getMilestones(projectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Milestones retrieved successfully',
    data: result,
  });
});

const updateMilestone = catchAsync(async (req: Request, res: Response) => {
  const { projectId, milestoneId } = req.params;
  const updateData = req.body;

  const result = await ProjectService.updateMilestone(projectId, milestoneId, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Milestone updated successfully',
    data: result,
  });
});

const deleteMilestone = catchAsync(async (req: Request, res: Response) => {
  const { projectId, milestoneId } = req.params;

  await ProjectService.deleteMilestone(projectId, milestoneId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Milestone deleted successfully',
    data: null,
  });
});

export const MilestoneController = {
  createMilestone,
  getMilestones,
  updateMilestone,
  deleteMilestone,
};
