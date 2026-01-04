import express from 'express';
import { RatingController } from './rating.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Submit a rating
router.post(
  '/',
  auth('developer', 'manager'),
  RatingController.createRating
);

// Get ratings for a specific user
router.get(
  '/user/:userId',
  RatingController.getUserRatings
);

// Get ratings given by current user
router.get(
  '/given',
  auth('developer', 'manager'),
  RatingController.getRatingsGivenByUser
);

// Get ratings received by current user
router.get(
  '/received',
  auth('developer', 'manager'),
  RatingController.getRatingsReceivedByUser
);

// Check if user has rated an entity
router.get(
  '/check/:entityType/:entityId',
  auth('developer', 'manager'),
  RatingController.checkIfRated
);

export const RatingRoutes = router;
