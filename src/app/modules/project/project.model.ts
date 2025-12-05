import mongoose, { Schema, Document } from 'mongoose';

export interface IMilestone {
  name: string;
  dueDate: Date;
  completed: boolean;
}

export interface IActivityLog {
  action: string;
  details?: string;
  timestamp: Date;
  taskId?: string;
}

export interface IProject extends Document {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  progress: number;
  milestones: IMilestone[];
  activityLog: IActivityLog[];
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema({
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
});

const ActivityLogSchema = new Schema({
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
});

const ProjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number, required: true },
    progress: { type: Number, default: 0 },
    milestones: [MilestoneSchema],
    activityLog: [ActivityLogSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
// Virtual populate for tasks
ProjectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'projectId',
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
