import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: string;
  message: string;
  type: 'assignment' | 'update' | 'payment' | 'deadline' | 'mention';
  relatedId?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['assignment', 'update', 'payment', 'deadline', 'mention'],
      required: true,
    },
    relatedId: { type: Schema.Types.ObjectId }, // Can ref Task, Project, etc.
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
