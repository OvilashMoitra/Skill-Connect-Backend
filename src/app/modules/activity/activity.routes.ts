import express from 'express';
import { ActivityController } from './activity.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// Get project activity (managers and developers can view)
router.get(
  '/project/:projectId',
  auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER),
  ActivityController.getProjectActivity
);

// Get user activity (user can view their own, managers can view any)
router.get(
  '/user/:userId',
  auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER),
  ActivityController.getUserActivity
);

// Get task activity
router.get(
  '/task/:taskId',
  auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER),
  ActivityController.getTaskActivity
);

export const ActivityRoutes = router;
