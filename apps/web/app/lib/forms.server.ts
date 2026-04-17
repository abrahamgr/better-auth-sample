import { data } from 'react-router'
import type { ZodIssue, ZodType } from 'zod'

import { logger } from './logger.server'

type ActionFailurePayload = {
  fieldErrors: Record<string, string>
  formError?: string
  ok: false
}

export type ActionFailure = ActionFailurePayload

export function toObject(formData: FormData) {
  return Object.fromEntries(formData.entries())
}

function formatIssues(issues: ZodIssue[]) {
  return Object.fromEntries(
    issues.map((issue) => [issue.path.join('.') || 'form', issue.message]),
  )
}

export function validateForm<T>({
  context,
  formData,
  schema,
}: {
  context: string
  formData: FormData
  schema: ZodType<T>
}) {
  const candidate = toObject(formData)
  const result = schema.safeParse(candidate)

  if (!result.success) {
    logger.warn(
      {
        context,
        issues: result.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.join('.') || 'form',
        })),
      },
      'Server-side validation failed.',
    )

    return {
      error: data<ActionFailurePayload>(
        {
          fieldErrors: formatIssues(result.error.issues),
          ok: false,
        },
        { status: 400 },
      ),
    }
  }

  logger.info({ context }, 'Server-side validation passed.')

  return {
    value: result.data,
  }
}

export function actionFailure(formError: string, status = 400) {
  return data<ActionFailurePayload>(
    {
      fieldErrors: {},
      formError,
      ok: false,
    },
    { status },
  )
}

export function toStatusCode(status: number | string | undefined) {
  return typeof status === 'number' ? status : Number(status) || 400
}
