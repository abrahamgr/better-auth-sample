import pino from 'pino'

import { env } from './env.server'

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      'password',
      '*.password',
      'headers.cookie',
      'headers.authorization',
      'token',
      '*.token',
      'newPassword',
      'currentPassword',
      '*.newPassword',
      '*.currentPassword',
    ],
    remove: true,
  },
  transport: import.meta.env.DEV ? { target: 'pino-pretty' } : undefined,
})
