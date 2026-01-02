import { Task } from '../task/task.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import fs from 'fs';
import path from 'path';
import { ActivityService } from '../activity/activity.service';

const uploadFile = async (taskId: string, file: Express.Multer.File, userId: string) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const attachment = {
    filename: file.filename,
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    uploadedBy: userId,
    uploadedAt: new Date(),
  };

  task.attachments.push(attachment as any);
  await task.save();
  
  // Log file upload activity
  await ActivityService.logActivity(task.projectId.toString(), {
    userId,
    action: 'file_uploaded',
    entityType: 'file',
    entityId: (task.attachments[task.attachments.length - 1] as any)._id.toString(),
    details: {
      description: `Uploaded file: ${file.originalname}`,
      metadata: {
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        taskId: taskId
      }
    }
  });

  return attachment;
};

const getFileInfo = async (taskId: string, fileId: string) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const attachment = task.attachments.find((att: any) => att._id.toString() === fileId);
  if (!attachment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }

  return attachment;
};

const deleteFile = async (taskId: string, fileId: string, userId: string) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  const attachmentIndex = task.attachments.findIndex((att: any) => att._id.toString() === fileId);
  if (attachmentIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }

  const attachment = task.attachments[attachmentIndex];
  const originalName = (attachment as any).originalName;
  
  // Delete file from filesystem
  const filePath = path.join(__dirname, '../../../uploads', (attachment as any).filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove from database
  task.attachments.splice(attachmentIndex, 1);
  await task.save();
  
  // Log file deletion activity
  await ActivityService.logActivity(task.projectId.toString(), {
    userId,
    action: 'file_deleted',
    entityType: 'file',
    entityId: fileId,
    details: {
      description: `Deleted file: ${originalName}`,
      metadata: {
        filename: originalName,
        taskId: taskId
      }
    }
  });

  return true;
};

export const FileService = {
  uploadFile,
  getFileInfo,
  deleteFile,
};
