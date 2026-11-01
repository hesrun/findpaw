import { z } from 'zod';
import { Constants } from '@supabase/database.types';

// Roles a user may pick at sign-up: every database role except 'admin',
// which is assigned only by an administrator.
const SignUpRoleSchema = z
    .enum(Constants.public.Enums.user_role)
    .exclude(['admin']);

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const SignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    userName: z.string().trim().min(3),
    role: SignUpRoleSchema.catch('user'),
});

export type SignUpRole = z.infer<typeof SignUpRoleSchema>;
export type SignIn = z.infer<typeof SignInSchema>;
export type SignUp = z.infer<typeof SignUpSchema>;
