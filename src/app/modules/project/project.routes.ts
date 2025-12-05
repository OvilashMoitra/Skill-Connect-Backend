import express from 'express';
import { ProjectController } from './project.controller';

const router = express.Router();

router.post('/', ProjectController.createProject);
router.get('/', ProjectController.getAllProjects);
router.get('/:id', ProjectController.getProjectById);

export const ProjectRoutes = router;
