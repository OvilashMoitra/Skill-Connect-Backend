import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { ProjectRoutes } from '../modules/project/project.routes';
import { TaskRoutes } from '../modules/task/task.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ProfileRoutes } from '../modules/profile/profile.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/projects',
    route: ProjectRoutes,
  },
  {
    path: '/tasks',
    route: TaskRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;