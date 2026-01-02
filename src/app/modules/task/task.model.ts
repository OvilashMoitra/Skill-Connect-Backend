import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  text: string;
  authorId: string;
  timestamp: Date;
  isPrivate: boolean;
}

export interface IAttachment {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  deadline: Date;
  estimatedTime: number;
  status: 'not-started' | 'in-progress' | 'completed';
  timeLogged: number;
  startDate?: Date;
  completedDate?: Date;
  projectId: string;
  milestoneId?: string;
  assigneeId?: string;
  assignee?: string;
  comments: IComment[];
  attachments: IAttachment[];
  dependencies: string[]; // Array of Task IDs
  timeLogs: {
    startTime: Date;
    endTime?: Date;
    duration?: number;
    userId: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema({
  text: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
  timestamp: { type: Date, default: Date.now },
  isPrivate: { type: Boolean, default: false },
});

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
    deadline: { type: Date, required: true },
    estimatedTime: { type: Number, required: true },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      required: true,
    },
    timeLogged: { type: Number, default: 0 },
    startDate: { type: Date },
    completedDate: { type: Date },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    milestoneId: { type: Schema.Types.ObjectId, ref: 'Project.milestones' },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'Auth' },
    assignee: { type: String }, // For frontend compatibility
    comments: [CommentSchema],
    attachments: [
      {
        filename: { type: String, required: true },
        originalName: { type: String, required: true },
        mimetype: { type: String, required: true },
        size: { type: Number, required: true },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // ... existing fields ...
    dependencies: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    timeLogs: [
      {
        startTime: { type: Date, required: true },
        endTime: { type: Date },
        duration: { type: Number }, // in seconds
        userId: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);
