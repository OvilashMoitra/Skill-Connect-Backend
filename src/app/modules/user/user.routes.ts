import express from 'express';
import { UserController } from './user.controller';
import { AuthRoutes } from './auth.routes';

const router = express.Router();

router.use('/auth', AuthRoutes);
router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

export const UserRoutes = router;
