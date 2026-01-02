import { Request, Response } from 'express';
import { FileService } from './file.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import path from 'path';

const uploadFile = catchAsync(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const file = req.file;
  const userId = req.user!.userId;

  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const result = await FileService.uploadFile(taskId, file, userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File uploaded successfully',
    data: result,
  });
});

const downloadFile = catchAsync(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const { taskId } = req.query;

  const fileInfo = await FileService.getFileInfo(taskId as string, fileId);
  
  if (!fileInfo) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }

  const filePath = path.join(__dirname, '../../../uploads', fileInfo.filename);
  res.download(filePath, fileInfo.originalName);
});

const deleteFile = catchAsync(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const { taskId } = req.query;
  const userId = req.user!.userId;

  await FileService.deleteFile(taskId as string, fileId, userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File deleted successfully',
    data: null,
  });
});

export const FileController = {
  uploadFile,
  downloadFile,
  deleteFile,
};
