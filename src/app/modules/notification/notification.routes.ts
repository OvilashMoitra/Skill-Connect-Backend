import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Get user's notifications
router.get(
  '/',
  auth('developer', 'manager'),
  NotificationController.getUserNotifications
);

// Get unread count
router.get(
  '/unread-count',
  auth('developer', 'manager'),
  NotificationController.getUnreadCount
);

// Mark notification as read
router.patch(
  '/:id/read',
  auth('developer', 'manager'),
  NotificationController.markAsRead
);

// Mark all notifications as read
router.patch(
  '/mark-all-read',
  auth('developer', 'manager'),
  NotificationController.markAllAsRead
);

// Delete notification
router.delete(
  '/:id',
  auth('developer', 'manager'),
  NotificationController.deleteNotification
);

export const NotificationRoutes = router;
