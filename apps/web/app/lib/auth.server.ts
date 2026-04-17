import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { APIError } from 'better-auth/api'

import { db } from './db/index.server'
import { sendPasswordResetEmail } from './email.server'
import { env } from './env.server'
import { logger } from './logger.server'

export const auth = betterAuth({
  appName: 'Better Auth Sample',
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
    sendResetPassword: async ({ token, url, user }) => {
      logger.info(
        { email: user.email, userId: user.id },
        'Password reset requested.',
      )
      void sendPasswordResetEmail({
        resetUrl: url,
        userEmail: user.email,
        userId: user.id,
        userName: user.name,
      }).catch((error) => {
        logger.error(
          { error, userId: user.id },
          'Password reset email dispatch failed.',
        )
      })
      logger.debug(
        { tokenIssued: Boolean(token), userId: user.id },
        'Reset token issued.',
      )
    },
  },
  experimental: {
    joins: true,
  },
  rateLimit: {
    enabled: true,
    max: 100,
    window: 60,
  },
  secret: env.BETTER_AUTH_SECRET,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  trustedOrigins: [env.APP_URL],
})

export type AppSession = typeof auth.$Infer.Session

export async function getServerSession(request: Request) {
  try {
    return await auth.api.getSession({
      headers: request.headers,
    })
  } catch (error) {
    if (error instanceof APIError) {
      logger.warn({ error }, 'Failed to resolve the current session.')
      return null
    }

    throw error
  }
}
