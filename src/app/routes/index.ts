import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { ProjectRoutes } from '../modules/project/project.routes';
import { TaskRoutes } from '../modules/task/task.routes';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { NotificationRoutes } from '../modules/notification/notification.route';
import { FeedbackRoutes } from '../modules/feedback/feedback.route';
import { FileRoutes } from '../modules/file/file.routes';
import { MilestoneRoutes } from '../modules/milestone/milestone.routes';
import { ActivityRoutes } from '../modules/activity/activity.routes';

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
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/feedbacks',
    route: FeedbackRoutes,
  },
  {
    path: '/files',
    route: FileRoutes,
  },
  {
    path: '/milestones',
    route: MilestoneRoutes,
  },
  {
    path: '/activity',
    route: ActivityRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;