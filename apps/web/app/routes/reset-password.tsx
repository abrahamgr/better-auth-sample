import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Field,
  FieldError,
  FieldLabel,
  InlineMessage,
  Input,
} from '@workspace/ui'
import { APIError } from 'better-auth/api'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  data,
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from 'react-router'
import { auth } from '../lib/auth.server'
import { actionFailure, toStatusCode, validateForm } from '../lib/forms.server'
import { logger } from '../lib/logger.server'
import { type ResetPasswordInput, resetPasswordSchema } from '../lib/validation'
import type { Route } from './+types/reset-password'

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  const error = url.searchParams.get('error')

  if (error) {
    return data({
      error: 'The password reset link is invalid or has expired.',
      token: null,
    })
  }

  return data({ error: null as string | null, token })
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const validated = validateForm({
    context: 'reset-password',
    formData,
    schema: resetPasswordSchema,
  })

  if ('error' in validated) {
    return validated.error
  }

  try {
    await auth.api.resetPassword({
      body: validated.value,
      headers: request.headers,
    })

    logger.info({ tokenPresent: true }, 'Password reset completed.')

    return redirect('/login')
  } catch (error) {
    if (error instanceof APIError) {
      logger.warn({ status: error.status }, 'Password reset failed.')
      return actionFailure(error.message, toStatusCode(error.status))
    }

    throw error
  }
}

export default function ResetPassword({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const token = loaderData.token ?? searchParams.get('token') ?? ''
  const isSubmitting = navigation.state === 'submitting'
  const form = useForm<ResetPasswordInput>({
    defaultValues: {
      newPassword: '',
      token,
    },
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    form.setValue('token', token)
  }, [form, token])

  useEffect(() => {
    if (!actionData?.fieldErrors) {
      return
    }

    for (const [field, message] of Object.entries(actionData.fieldErrors)) {
      form.setError(field as keyof ResetPasswordInput, { message })
    }
  }, [actionData, form])

  if (!token || loaderData.error) {
    return (
      <div className="space-y-5">
        <InlineMessage tone="danger">
          {loaderData.error ?? 'A reset token is required.'}
        </InlineMessage>
        <Link
          className="text-sm font-semibold text-[var(--color-accent)]"
          to="/forgot-password"
        >
          Request a new reset link
        </Link>
      </div>
    )
  }

  return (
    <Form
      className="space-y-5"
      method="post"
      onSubmit={form.handleSubmit((values) =>
        submit(values, { method: 'post' }),
      )}
    >
      {actionData?.formError ? (
        <InlineMessage tone="danger">{actionData.formError}</InlineMessage>
      ) : null}
      <input type="hidden" value={token} {...form.register('token')} />
      <Field>
        <FieldLabel htmlFor="newPassword">New password</FieldLabel>
        <Input
          id="newPassword"
          type="password"
          {...form.register('newPassword')}
        />
        <FieldError>{form.formState.errors.newPassword?.message}</FieldError>
      </Field>
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Updating password...' : 'Set new password'}
      </Button>
      <p className="text-sm text-[var(--color-muted)]">
        No longer need this?{' '}
        <Link className="font-semibold text-[var(--color-accent)]" to="/login">
          Return to login
        </Link>
        .
      </p>
    </Form>
  )
}
