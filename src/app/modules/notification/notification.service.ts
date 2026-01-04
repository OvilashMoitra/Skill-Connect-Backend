import { Notification, INotification } from './notification.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createNotification = async (data: {
  userId: string;
  type: INotification['type'];
  title: string;
  message: string;
  relatedEntity: {
    entityType: 'task' | 'project' | 'comment' | 'file';
    entityId: string;
  };
}): Promise<INotification> => {
  const notification = await Notification.create(data);
  return notification;
};

const getUserNotifications = async (
  userId: string,
  options: {
    isRead?: boolean;
    limit?: number;
    skip?: number;
  } = {}
): Promise<{ notifications: INotification[]; total: number }> => {
  const { isRead, limit = 50, skip = 0 } = options;

  const query: any = { userId };
  if (isRead !== undefined) {
    query.isRead = isRead;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await Notification.countDocuments(query);

  return { notifications: notifications as INotification[], total };
};

const getUnreadCount = async (userId: string): Promise<number> => {
  const count = await Notification.countDocuments({
    userId,
    isRead: false,
  });
  return count;
};

const markAsRead = async (notificationId: string, userId: string): Promise<INotification | null> => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  return notification;
};

const markAllAsRead = async (userId: string): Promise<{ modifiedCount: number }> => {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );

  return { modifiedCount: result.modifiedCount };
};

const deleteNotification = async (notificationId: string, userId: string): Promise<boolean> => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  return true;
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
