import { Project, IProject } from './project.model';

const createProject = async (data: IProject): Promise<IProject> => {
  const result = await Project.create(data);
  return result;
};

const getAllProjects = async (): Promise<IProject[]> => {
  const result = await Project.find().populate('tasks');
  return result;
};

const getProjectById = async (id: string): Promise<IProject | null> => {
  const result = await Project.findById(id).populate('tasks');
  return result;
};

export const ProjectService = {
  createProject,
  getAllProjects,
  getProjectById,
};
