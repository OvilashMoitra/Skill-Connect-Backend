import express from 'express';
import { FileController } from './file.controller';
import { upload } from '../../middlewares/upload';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// Upload file to task (both managers and developers can upload)
router.post(
  '/upload/:taskId',
  auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER),
  upload.single('file'),
  FileController.uploadFile
);

// Download file
router.get(
  '/:fileId',
  auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER),
  FileController.downloadFile
);

// Delete file (only managers can delete)
router.delete(
  '/:fileId',
  auth(ENUM_USER_ROLE.MANAGER),
  FileController.deleteFile
);

export const FileRoutes = router;
