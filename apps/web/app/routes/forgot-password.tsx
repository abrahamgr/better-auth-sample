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
  useActionData,
  useNavigation,
  useSubmit,
} from 'react-router'
import { auth } from '../lib/auth.server'
import { env } from '../lib/env.server'
import { validateForm } from '../lib/forms.server'
import { logger } from '../lib/logger.server'
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from '../lib/validation'
import type { Route } from './+types/forgot-password'

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const validated = validateForm({
    context: 'forgot-password',
    formData,
    schema: forgotPasswordSchema,
  })

  if ('error' in validated) {
    return validated.error
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: validated.value.email,
        redirectTo: `${env.APP_URL}/reset-password`,
      },
      headers: request.headers,
    })
  } catch (error) {
    if (error instanceof APIError) {
      logger.warn(
        { email: validated.value.email, status: error.status },
        'Password reset request returned an API error.',
      )
    } else {
      throw error
    }
  }

  logger.info(
    { email: validated.value.email },
    'Password reset flow requested.',
  )

  return data({
    fieldErrors: {},
    ok: true as const,
    successMessage: 'If that email exists, a reset link has been sent.',
  })
}

export default function ForgotPassword() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const isSubmitting = navigation.state === 'submitting'
  const form = useForm<ForgotPasswordInput>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotPasswordSchema),
  })

  useEffect(() => {
    if (!actionData?.fieldErrors) {
      return
    }

    for (const [field, message] of Object.entries(actionData.fieldErrors)) {
      form.setError(field as keyof ForgotPasswordInput, { message })
    }
  }, [actionData, form])

  return (
    <Form
      className="space-y-5"
      method="post"
      onSubmit={form.handleSubmit((values) =>
        submit(values, { method: 'post' }),
      )}
    >
      {actionData && 'successMessage' in actionData ? (
        <InlineMessage tone="success">
          {actionData.successMessage}
        </InlineMessage>
      ) : null}
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          placeholder="you@example.com"
          {...form.register('email')}
        />
        <FieldError>{form.formState.errors.email?.message}</FieldError>
      </Field>
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Sending link...' : 'Send reset link'}
      </Button>
      <p className="text-sm text-[var(--color-muted)]">
        Remembered it?{' '}
        <Link className="font-semibold text-[var(--color-accent)]" to="/login">
          Back to login
        </Link>
        .
      </p>
    </Form>
  )
}
