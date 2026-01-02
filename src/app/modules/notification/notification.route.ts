import express from 'express';
import { NotificationController } from './notification.controller';

const router = express.Router();

router.get('/', NotificationController.getUserNotifications);
router.patch('/:id/read', NotificationController.markAsRead);

export const NotificationRoutes = router;
