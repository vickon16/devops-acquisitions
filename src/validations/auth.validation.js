import { z } from 'zod';

export const roles = ['user', 'admin'];

export const signUpSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long').trim(),
  email: z.email('Invalid email address').max(255).toLowerCase().trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password must be at most 128 characters long'),
  role: z.enum(roles).default('user'),
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});
