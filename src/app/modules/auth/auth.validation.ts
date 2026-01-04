import { z } from 'zod';

const createAuthZodSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    role: z.enum(['super_admin', 'project_manager', 'developer'], {
      required_error: 'Role is required',
    }),
    paid: z.boolean().optional(),
  }),
});

const loginAuthZodSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const AuthValidation = {
  createAuthZodSchema,
  loginAuthZodSchema,
};
