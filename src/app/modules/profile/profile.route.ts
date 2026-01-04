import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import optionalAuth from '../../middlewares/optionalAuth';
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

// Search profiles - optional authentication (must come before /:userId)
router.get(
  '/search',
  optionalAuth,
  ProfileController.searchProfiles
);

// Public profile route - optional authentication for visibility checks
router.get(
  '/:userId',
  optionalAuth,
  ProfileController.getPublicProfile
);

router.patch(
  '/',
  auth('super_admin', 'project_manager', 'developer'),
  validateRequest(ProfileValidation.updateProfileZodSchema),
  ProfileController.updateProfile
);

export const ProfileRoutes = router;
