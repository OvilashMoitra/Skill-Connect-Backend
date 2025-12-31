import express from 'express';
import { FeedbackController } from './feedback.controller';

const router = express.Router();

router.post('/', FeedbackController.createFeedback);
router.get('/:projectId', FeedbackController.getFeedbacks);

export const FeedbackRoutes = router;
