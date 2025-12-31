import { Project, IProject } from './project.model';

const createProject = async (data: IProject): Promise<IProject> => {
  const result = await Project.create(data);
  return result;
};

import { Profile } from '../profile/profile.model';

const getAllProjects = async (userId: string, role: string): Promise<IProject[]> => {
  let query = {};
  if (role === 'project_manager') {
    query = { manager: userId };
  } else if (role === 'developer') {
    query = { team: userId };
  }

  const projects = await Project.find(query)
    .populate('tasks')
    .populate('team', 'email role')
    .populate('manager', 'email');

  // Manually populate names from Profile
  const populatedProjects = await Promise.all(projects.map(async (project) => {
    const projectObj = project.toObject({ virtuals: true });

    // Populate team names
    if (projectObj.team && projectObj.team.length > 0) {
      projectObj.team = await Promise.all(projectObj.team.map(async (member: any) => {
        const profile = await Profile.findOne({ auth: member._id });
        return { ...member, name: profile?.name || 'Unknown' };
      }));
    }

    // Populate manager name
    if (projectObj.manager) {
      const mgrProfile = await Profile.findOne({ auth: (projectObj.manager as any)._id });
      projectObj.manager = { ...projectObj.manager as any, name: mgrProfile?.name || 'Unknown' };
    }

    // Populate task assignees
    if (projectObj.tasks && projectObj.tasks.length > 0) {
      projectObj.tasks = await Promise.all(projectObj.tasks.map(async (task: any) => {
        if (task.assigneeId) {
          const profile = await Profile.findOne({ auth: task.assigneeId });
          task.assignee = profile?.name || 'Unknown';
        }
        return task;
      }));
    }

    return projectObj;
  }));

  return populatedProjects as any;
};

const getProjectById = async (id: string): Promise<IProject | null> => {
  const project = await Project.findById(id)
    .populate('tasks')
    .populate('team', 'email role')
    .populate('manager', 'email');

  if (!project) return null;

  const projectObj = project.toObject({ virtuals: true });

  // Populate team names
  if (projectObj.team && projectObj.team.length > 0) {
    projectObj.team = await Promise.all(projectObj.team.map(async (member: any) => {
      const profile = await Profile.findOne({ auth: member._id });
      return { ...member, name: profile?.name || 'Unknown' };
    }));
  }

  // Populate manager name
  if (projectObj.manager) {
    const mgrProfile = await Profile.findOne({ auth: (projectObj.manager as any)._id });
    projectObj.manager = { ...projectObj.manager as any, name: mgrProfile?.name || 'Unknown' };
  }

  // Populate task assignees
  if (projectObj.tasks && projectObj.tasks.length > 0) {
    projectObj.tasks = await Promise.all(projectObj.tasks.map(async (task: any) => {
      if (task.assigneeId) {
        const profile = await Profile.findOne({ auth: task.assigneeId });
        task.assignee = profile?.name || 'Unknown';
      }
      return task;
    }));
  }

  return projectObj as any;
};

const getDashboardStats = async () => {
  const totalProjects = await Project.countDocuments();
  const projects = await Project.find();
  const completedProjects = projects.filter(p => p.progress === 100).length;
  const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);

  const totalTasks = await import('../task/task.model').then((m) => m.Task.countDocuments());
  const pendingTasks = await import('../task/task.model').then((m) => m.Task.countDocuments({ status: { $ne: 'completed' } }));
  const completedTasks = await import('../task/task.model').then((m) => m.Task.countDocuments({ status: 'completed' }));

  const upcomingDeadlines = await import('../task/task.model').then((m) =>
    m.Task.find({ deadline: { $gte: new Date() }, status: { $ne: 'completed' } })
      .sort({ deadline: 1 })
      .limit(5)
      .select('title deadline priority')
  );

  return {
    totalProjects,
    completedProjects,
    totalBudget,
    totalTasks,
    pendingTasks,
    completedTasks,
    upcomingDeadlines,
  };
};

const addTeamMember = async (projectId: string, userId: string): Promise<IProject | null> => {
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $addToSet: { team: userId } },
    { new: true }
  )
    .populate('tasks')
    .populate('team', 'email role')
    .populate('manager', 'email');

  if (!project) return null;

  const projectObj = project.toObject({ virtuals: true });

  // Populate team names
  if (projectObj.team && projectObj.team.length > 0) {
    projectObj.team = await Promise.all(projectObj.team.map(async (member: any) => {
      const profile = await Profile.findOne({ auth: member._id });
      return { ...member, name: profile?.name || 'Unknown' };
    }));
  }

  return projectObj as any;
};

// Milestone Management
const addMilestone = async (projectId: string, milestoneData: any) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  project.milestones.push(milestoneData);
  await project.save();

  return project.milestones[project.milestones.length - 1];
};

const getMilestones = async (projectId: string) => {
  const project = await Project.findById(projectId).populate('milestones.tasks');
  if (!project) {
    throw new Error('Project not found');
  }

  return project.milestones;
};

const updateMilestone = async (projectId: string, milestoneId: string, updateData: any) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const milestoneIndex = project.milestones.findIndex((m: any) => m._id.toString() === milestoneId);
  if (milestoneIndex === -1) {
    throw new Error('Milestone not found');
  }

  Object.assign(project.milestones[milestoneIndex], updateData);
  await project.save();

  return project.milestones[milestoneIndex];
};

const deleteMilestone = async (projectId: string, milestoneId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  project.milestones = project.milestones.filter((m: any) => m._id.toString() !== milestoneId);
  await project.save();

  return true;
};

export const ProjectService = {
  createProject,
  getAllProjects,
  getProjectById,
  getDashboardStats,
  addTeamMember,
  // Assuming updateProject, deleteProject, removeTeamMember are defined elsewhere or will be added
  // For now, only adding the new milestone methods and existing ones.
  // If the user intended to replace the entire export, these would be included.
  // As per instruction, only adding the new methods to the existing export.
  addMilestone,
  getMilestones,
  updateMilestone,
  deleteMilestone,
};
