import { z } from 'zod';

const createProfileZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    imageUrl: z.string().optional(),
    phoneNumber: z.string().optional(),
    skill: z.array(z.string()).optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
  }),
});

const updateProfileZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    imageUrl: z.string().optional(),
    phoneNumber: z.string().optional(),
    skill: z.array(z.string()).optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const ProfileValidation = {
  createProfileZodSchema,
  updateProfileZodSchema,
};
