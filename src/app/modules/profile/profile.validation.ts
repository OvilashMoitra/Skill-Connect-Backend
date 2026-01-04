import { z } from 'zod';

const skillSchema = z.object({
  name: z.string({ required_error: 'Skill name is required' }),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert'], {
    required_error: 'Proficiency level is required',
  }),
  category: z.string({ required_error: 'Category is required' }),
  isVisible: z.boolean().optional(),
});

const createProfileZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    imageUrl: z.string().optional(),
    phoneNumber: z.string().optional(),
    skill: z.array(skillSchema).optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
    visibility: z.enum(['public', 'private', 'selected']).optional(),
    selectedUsers: z.array(z.string()).optional(),
    skillsVisibility: z.boolean().optional(),
    projectsVisibility: z.boolean().optional(),
  }),
});

const updateProfileZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    imageUrl: z.string().optional(),
    phoneNumber: z.string().optional(),
    skill: z.array(skillSchema).optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
    visibility: z.enum(['public', 'private', 'selected']).optional(),
    selectedUsers: z.array(z.string()).optional(),
    skillsVisibility: z.boolean().optional(),
    projectsVisibility: z.boolean().optional(),
  }),
});

export const ProfileValidation = {
  createProfileZodSchema,
  updateProfileZodSchema,
};
