import { z } from 'zod';
import { roles, signUpSchema } from './auth.validation.js';

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive('ID must be a positive integer'),
});

export const updateUserSchema = z
  .object({
    name: signUpSchema.shape.name.optional(),
    email: signUpSchema.shape.email.optional(),
    role: z.enum(roles).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
