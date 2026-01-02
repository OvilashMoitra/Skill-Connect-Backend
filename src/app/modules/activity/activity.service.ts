import { Project } from '../project/project.model';

interface ActivityLogData {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: {
    oldValue?: any;
    newValue?: any;
    description?: string;
    metadata?: any;
  };
}

const logActivity = async (
  projectId: string,
  activityData: ActivityLogData
): Promise<void> => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  project.activityLog.push({
    ...activityData,
    timestamp: new Date(),
  } as any);

  await project.save();
};

const getProjectActivity = async (
  projectId: string,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    action?: string;
    userId?: string;
    limit?: number;
    skip?: number;
  }
) => {
  const project = await Project.findById(projectId)
    .populate('activityLog.userId', 'email role')
    .populate('activityLog.entityId');

  if (!project) {
    throw new Error('Project not found');
  }

  let activities = project.activityLog;

  // Apply filters
  if (filters) {
    if (filters.startDate) {
      activities = activities.filter((a: any) => new Date(a.timestamp) >= filters.startDate!);
    }
    if (filters.endDate) {
      activities = activities.filter((a: any) => new Date(a.timestamp) <= filters.endDate!);
    }
    if (filters.action) {
      activities = activities.filter((a: any) => a.action === filters.action);
    }
    if (filters.userId) {
      activities = activities.filter((a: any) => a.userId.toString() === filters.userId);
    }
  }

  // Sort by timestamp descending (newest first)
  activities = activities.sort((a: any, b: any) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Apply pagination
  if (filters?.skip) {
    activities = activities.slice(filters.skip);
  }
  if (filters?.limit) {
    activities = activities.slice(0, filters.limit);
  }

  return activities;
};

const getUserActivity = async (
  userId: string,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    action?: string;
    limit?: number;
    skip?: number;
  }
) => {
  // Find all projects where user is involved
  const projects = await Project.find({
    $or: [
      { manager: userId },
      { team: userId }
    ]
  }).populate('activityLog.userId', 'email role');

  let allActivities: any[] = [];

  projects.forEach(project => {
    const userActivities = project.activityLog.filter((a: any) => 
      a.userId.toString() === userId
    );
    allActivities = allActivities.concat(userActivities);
  });

  // Apply filters
  if (filters) {
    if (filters.startDate) {
      allActivities = allActivities.filter(a => new Date(a.timestamp) >= filters.startDate!);
    }
    if (filters.endDate) {
      allActivities = allActivities.filter(a => new Date(a.timestamp) <= filters.endDate!);
    }
    if (filters.action) {
      allActivities = allActivities.filter(a => a.action === filters.action);
    }
  }

  // Sort by timestamp descending
  allActivities = allActivities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Apply pagination
  if (filters?.skip) {
    allActivities = allActivities.slice(filters.skip);
  }
  if (filters?.limit) {
    allActivities = allActivities.slice(0, filters.limit);
  }

  return allActivities;
};

const getTaskActivity = async (taskId: string, projectId: string) => {
  const project = await Project.findById(projectId)
    .populate('activityLog.userId', 'email role');

  if (!project) {
    throw new Error('Project not found');
  }

  const taskActivities = project.activityLog.filter((a: any) => 
    a.entityId.toString() === taskId && a.entityType === 'task'
  );

  return taskActivities.sort((a: any, b: any) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const ActivityService = {
  logActivity,
  getProjectActivity,
  getUserActivity,
  getTaskActivity,
};
