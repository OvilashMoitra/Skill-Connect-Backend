import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  text: string;
  authorId: string;
  timestamp: Date;
  isPrivate: boolean;
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
  assigneeId?: string;
  comments: IComment[];
  dependencies: string[]; // Array of Task IDs
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema({
  text: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: [CommentSchema],
    dependencies: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Task = mongoose.model<ITask>('Task', TaskSchema);
