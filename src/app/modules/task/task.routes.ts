import express from 'express';
import { TaskController } from './task.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// Only managers can create tasks
router.post('/', auth(ENUM_USER_ROLE.MANAGER), TaskController.createTask);

// Both roles can view tasks
router.get('/', auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER), TaskController.getAllTasks);
router.get('/:id', auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER), TaskController.getTaskById);

// Both can update (developer can only update their own - enforced in service)
router.patch('/:id', auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER), TaskController.updateTask);

// Both can log time (developer can only log on their tasks - enforced in service)
router.post('/:id/log-time', auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER), TaskController.logTime);

// Both can add comments
router.post('/:id/comments', auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.DEVELOPER), TaskController.addComment);

export const TaskRoutes = router;

