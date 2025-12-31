import express from 'express';
import { MilestoneController } from './milestone.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// All milestone routes require manager authentication
router.post(
  '/:projectId',
  auth(ENUM_USER_ROLE.MANAGER),
  MilestoneController.createMilestone
);

router.get(
  '/:projectId',
  auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER),
  MilestoneController.getMilestones
);

router.patch(
  '/:projectId/:milestoneId',
  auth(ENUM_USER_ROLE.MANAGER),
  MilestoneController.updateMilestone
);

router.delete(
  '/:projectId/:milestoneId',
  auth(ENUM_USER_ROLE.MANAGER),
  MilestoneController.deleteMilestone
);

export const MilestoneRoutes = router;
