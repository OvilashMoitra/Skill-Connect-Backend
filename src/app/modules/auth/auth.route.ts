import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(AuthValidation.createAuthZodSchema),
  AuthController.createAuth
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginAuthZodSchema),
  AuthController.loginAuth
);

export const AuthRoutes = router;
