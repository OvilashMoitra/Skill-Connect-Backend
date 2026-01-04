import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'task_assigned' | 'task_updated' | 'comment_added' | 'status_changed' |
  'file_uploaded' | 'deadline_approaching' | 'team_member_added' | 'project_updated';
  title: string;
  message: string;
  relatedEntity: {
    entityType: 'task' | 'project' | 'comment' | 'file';
    entityId: mongoose.Types.ObjectId;
  };
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'task_assigned',
        'task_updated',
        'comment_added',
        'status_changed',
        'file_uploaded',
        'deadline_approaching',
        'team_member_added',
        'project_updated',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedEntity: {
      entityType: {
        type: String,
        enum: ['task', 'project', 'comment', 'file'],
        required: true,
      },
      entityId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
