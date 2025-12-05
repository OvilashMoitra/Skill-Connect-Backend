import { Task, ITask } from './task.model';

const createTask = async (data: ITask): Promise<ITask> => {
  const result = await Task.create(data);
  return result;
};

const getAllTasks = async (): Promise<ITask[]> => {
  const result = await Task.find()
    .populate('assigneeId')
    .populate('projectId')
    .populate('dependencies');
  return result;
};

const getTaskById = async (id: string): Promise<ITask | null> => {
  const result = await Task.findById(id)
    .populate('assigneeId')
    .populate('projectId')
    .populate('dependencies');
  return result;
};

const updateTask = async (id: string, data: Partial<ITask>): Promise<ITask | null> => {
  const result = await Task.findByIdAndUpdate(id, data, { new: true });
  return result;
};

export const TaskService = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
};
