import { Task, ITask } from './task.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

import { Profile } from '../profile/profile.model';
import { ActivityService } from '../activity/activity.service';
import { NotificationService } from '../notification/notification.service';

const createTask = async (data: ITask): Promise<ITask> => {
  // Map assignee (ID string) to assigneeId if present
  if (data.assignee) {
    data.assigneeId = data.assignee;
  }
  const result = await Task.create(data);

  // Log activity
  if (data.projectId) {
    await ActivityService.logActivity(data.projectId.toString(), {
      userId: data.assigneeId?.toString() || '',
      action: 'task_created',
      entityType: 'task',
      entityId: result._id.toString(),
      details: {
        description: `Created task: ${result.title}`,
        metadata: {
          priority: result.priority,
          status: result.status,
          estimatedTime: result.estimatedTime
        }
      }
    });
  }

  // Create notification for assignee
  if (data.assigneeId) {
    await NotificationService.createNotification({
      userId: data.assigneeId.toString(),
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: `You have been assigned to "${result.title}"`,
      relatedEntity: {
        entityType: 'task',
        entityId: result._id.toString()
      }
    });
  }

  return result;
};

const populateTaskNames = async (task: any) => {
  if (!task) return null;
  const taskObj = task.toObject ? task.toObject() : task;

  // Populate assignee name
  if (taskObj.assigneeId) {
    const profile = await Profile.findOne({ auth: taskObj.assigneeId._id || taskObj.assigneeId });
    taskObj.assignee = profile?.name || taskObj.assignee; // Set assignee name for frontend
    taskObj.assigneeId = { ...taskObj.assigneeId, name: profile?.name || 'Unknown' };
  }

  // Populate comment authors
  if (taskObj.comments && taskObj.comments.length > 0) {
    taskObj.comments = await Promise.all(taskObj.comments.map(async (c: any) => {
      const profile = await Profile.findOne({ auth: c.authorId });
      return { ...c, author: profile?.name || 'Unknown' };
    }));
  }

  return taskObj;
}

const getAllTasks = async (): Promise<ITask[]> => {
  const result = await Task.find()
    .populate('assigneeId')
    .populate('projectId')
    .populate('dependencies');

  return Promise.all(result.map(t => populateTaskNames(t)));
};

const getTaskById = async (id: string): Promise<ITask | null> => {
  const result = await Task.findById(id)
    .populate('assigneeId')
    .populate('projectId')
    .populate('dependencies');

  return populateTaskNames(result);
};

const logTime = async (
  id: string,
  userId: string,
  data: { startTime?: Date; endTime?: Date }
): Promise<ITask | null> => {
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  // Manual entry (both start and end provided)
  if (data.startTime && data.endTime) {
    const duration = (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / 1000;
    task.timeLogs.push({
      startTime: data.startTime,
      endTime: data.endTime,
      duration,
      userId,
    } as any);
  }
  // Start timer (only start provided)
  else if (data.startTime && !data.endTime) {
    // Check if user already has a running timer for this task
    const activeLog = task.timeLogs.find((log: any) => log.userId.toString() === userId && !log.endTime);
    if (activeLog) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You already have a running timer for this task');
    }
    task.timeLogs.push({
      startTime: data.startTime,
      userId,
    } as any);
  }
  // Stop timer (only end provided)
  else if (!data.startTime && data.endTime) {
    const activeLog = task.timeLogs.find((log: any) => log.userId.toString() === userId && !log.endTime);
    if (!activeLog) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No running timer found to stop');
    }
    activeLog.endTime = data.endTime;
    activeLog.duration = (new Date(data.endTime).getTime() - new Date(activeLog.startTime).getTime()) / 1000;
  }

  // Recalculate total timeLogged
  task.timeLogged = task.timeLogs.reduce((acc, log: any) => acc + (log.duration || 0), 0);

  await task.save();

  // Log time logging activity
  if (data.startTime && data.endTime) {
    const duration = (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / 3600000; // hours
    await ActivityService.logActivity(task.projectId.toString(), {
      userId,
      action: 'time_logged',
      entityType: 'task',
      entityId: task._id.toString(),
      details: {
        newValue: duration,
        description: `Logged ${duration.toFixed(2)} hours`,
        metadata: { totalTime: task.timeLogged / 3600 }
      }
    });
  }

  return task;
};


const addComment = async (id: string, data: { text: string; authorId: string }) => {
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  task.comments.push({
    text: data.text,
    authorId: data.authorId,
    timestamp: new Date(),
    isPrivate: false,
  });
  await task.save();

  // Log comment activity
  await ActivityService.logActivity(task.projectId.toString(), {
    userId: data.authorId,
    action: 'comment_added',
    entityType: 'task',
    entityId: task._id.toString(),
    details: {
      description: `Added a comment`,
      metadata: { commentText: data.text.substring(0, 50) + (data.text.length > 50 ? '...' : '') }
    }
  });

  return task;
};


const updateTask = async (id: string, data: Partial<ITask>, userId?: string, role?: string): Promise<ITask | null> => {
  const task = await Task.findById(id).populate('dependencies');
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  // Developer can only update their own assigned tasks
  if (role === 'developer' && task.assigneeId?.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only update tasks assigned to you');
  }

  // Check if status is being updated to in-progress or completed
  if (data.status && (data.status === 'in-progress' || data.status === 'completed')) {
    if (task.dependencies && task.dependencies.length > 0) {
      const incompleteDependencies = (task.dependencies as unknown as ITask[]).filter(
        (dep: ITask) => dep.status !== 'completed'
      );

      if (incompleteDependencies.length > 0) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Cannot start task. The following dependencies are not completed: ${incompleteDependencies
            .map((d) => d.title)
            .join(', ')}`
        );
      }
    }
  }

  const result = await Task.findByIdAndUpdate(id, data, { new: true }).populate('dependencies');

  // Log activity for status change
  if (data.status && result) {
    await ActivityService.logActivity(result.projectId.toString(), {
      userId: userId || '',
      action: 'status_changed',
      entityType: 'task',
      entityId: result._id.toString(),
      details: {
        oldValue: task.status,
        newValue: data.status,
        description: `Changed status from ${task.status} to ${data.status}`
      }
    });
  } else if (result) {
    // Log general task update
    await ActivityService.logActivity(result.projectId.toString(), {
      userId: userId || '',
      action: 'task_updated',
      entityType: 'task',
      entityId: result._id.toString(),
      details: {
        description: `Updated task: ${result.title}`,
        metadata: data
      }
    });
  }

  return result;
};

export const TaskService = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  logTime,
  addComment,
};
