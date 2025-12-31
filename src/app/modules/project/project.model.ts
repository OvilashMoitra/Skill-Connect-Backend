import mongoose, { Schema, Document } from 'mongoose';

export interface IMilestone {
  name: string;
  description?: string;
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100
  tasks: string[]; // Task IDs associated with this milestone
  createdAt?: Date;
}

export interface IActivityLog {
  userId: string; // User who performed the action
  action: 'task_created' | 'task_updated' | 'status_changed' |
  'comment_added' | 'file_uploaded' | 'file_deleted' |
  'time_logged' | 'assignee_changed' | 'project_updated' |
  'team_member_added' | 'milestone_created' | 'milestone_updated';
  entityType: 'task' | 'project' | 'milestone' | 'file';
  entityId: string; // ID of the affected entity
  details: {
    oldValue?: any;
    newValue?: any;
    description?: string;
    metadata?: any;
  };
  timestamp: Date;
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
  team: string[]; // User IDs
  manager: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  createdAt: { type: Date, default: Date.now },
});

const ActivityLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
  action: {
    type: String,
    required: true,
    enum: ['task_created', 'task_updated', 'status_changed', 'comment_added',
      'file_uploaded', 'file_deleted', 'time_logged', 'assignee_changed',
      'project_updated', 'team_member_added', 'milestone_created', 'milestone_updated']
  },
  entityType: { type: String, required: true, enum: ['task', 'project', 'milestone', 'file'] },
  entityId: { type: Schema.Types.ObjectId, required: true },
  details: {
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed }
  },
  timestamp: { type: Date, default: Date.now },
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
    team: [{ type: Schema.Types.ObjectId, ref: 'Auth' }],
    manager: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
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
