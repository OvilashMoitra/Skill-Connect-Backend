import { Notification, INotification } from './notification.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createNotification = async (data: INotification): Promise<INotification> => {
  const result = await Notification.create(data);
  return result;
};

const getUserNotifications = async (userId: string): Promise<INotification[]> => {
  const result = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 });
  return result;
};

const markAsRead = async (id: string): Promise<INotification | null> => {
  const notification = await Notification.findById(id);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  notification.isRead = true;
  await notification.save();
  return notification;
};

export const NotificationService = {
  createNotification,
  getUserNotifications,
  markAsRead,
};
