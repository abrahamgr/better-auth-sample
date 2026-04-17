import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.email().trim().toLowerCase(),
  name: z
    .string()
    .trim()
    .min(2, 'Enter your full name.')
    .max(80, 'Name must be 80 characters or fewer.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password must be 128 characters or fewer.'),
})

export const signInSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

export const forgotPasswordSchema = z.object({
  email: z.email().trim().toLowerCase(),
})

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password must be 128 characters or fewer.'),
  token: z.string().min(1, 'Reset token is missing.'),
})

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter your full name.')
    .max(80, 'Name must be 80 characters or fewer.'),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ProfileInput = z.infer<typeof profileSchema>
