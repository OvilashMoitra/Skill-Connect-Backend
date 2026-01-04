import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/', UserController.createUser);
router.get('/', auth('super_admin'), UserController.getAllUsers);
router.get('/analytics', auth('super_admin'), UserController.getPlatformAnalytics);
router.get('/:id', auth('super_admin'), UserController.getUserById);
router.patch('/:id/role', auth('super_admin'), UserController.updateUserRole);
router.patch('/:id/suspend', auth('super_admin'), UserController.suspendUser);
router.patch('/:id/activate', auth('super_admin'), UserController.activateUser);
router.patch('/:id/block', auth('super_admin'), UserController.blockUser);
router.patch('/:id/unblock', auth('super_admin'), UserController.unblockUser);

export const UserRoutes = router;
