import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ProfileValidation } from './profile.validation';
import { ProfileController } from './profile.controller';

const router = express.Router();

router.post(
  '/',
  auth('super_admin', 'project_manager', 'developer'),
  validateRequest(ProfileValidation.createProfileZodSchema),
  ProfileController.createProfile
);

router.get(
  '/',
  auth('super_admin', 'project_manager', 'developer'),
  ProfileController.getProfile
);

router.patch(
  '/',
  auth('super_admin', 'project_manager', 'developer'),
  validateRequest(ProfileValidation.updateProfileZodSchema),
  ProfileController.updateProfile
);

export const ProfileRoutes = router;
