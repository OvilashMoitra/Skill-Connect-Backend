import express from 'express';
import { ProjectController } from './project.controller';

import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(ENUM_USER_ROLE.MANAGER), ProjectController.createProject);
router.get('/', auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER), ProjectController.getAllProjects);
router.get('/dashboard-stats', auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER), ProjectController.getDashboardStats);
router.get('/:id', auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER), ProjectController.getProjectById);
router.post('/:id/team', auth(ENUM_USER_ROLE.MANAGER), ProjectController.addTeamMember);

export const ProjectRoutes = router;
