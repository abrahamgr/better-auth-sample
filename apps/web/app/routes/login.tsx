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
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
  useSubmit,
} from 'react-router'
import { auth, getServerSession } from '../lib/auth.server'
import { actionFailure, toStatusCode, validateForm } from '../lib/forms.server'
import { mergeHeaders } from '../lib/http.server'
import { logger } from '../lib/logger.server'
import { type SignInInput, signInSchema } from '../lib/validation'
import type { Route } from './+types/login'

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getServerSession(request)

  if (session) {
    throw redirect('/profile')
  }

  return null
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const validated = validateForm({
    context: 'login',
    formData,
    schema: signInSchema,
  })

  if ('error' in validated) {
    return validated.error
  }

  try {
    const { headers } = await auth.api.signInEmail({
      body: validated.value,
      headers: request.headers,
      returnHeaders: true,
    })

    logger.info({ email: validated.value.email }, 'User signed in.')

    return redirect('/profile', {
      headers: mergeHeaders(headers),
    })
  } catch (error) {
    if (error instanceof APIError) {
      logger.warn(
        { email: validated.value.email, status: error.status },
        'Sign-in failed.',
      )
      return actionFailure(error.message, toStatusCode(error.status))
    }

    throw error
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const isSubmitting = navigation.state === 'submitting'
  const form = useForm<SignInInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  })

  useEffect(() => {
    if (!actionData?.fieldErrors) {
      return
    }

    for (const [field, message] of Object.entries(actionData.fieldErrors)) {
      form.setError(field as keyof SignInInput, { message })
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
      {actionData?.formError ? (
        <InlineMessage tone="danger">{actionData.formError}</InlineMessage>
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
      <Field>
        <div className="flex items-center justify-between gap-4">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Link
            className="text-sm font-medium text-[var(--color-accent)]"
            to="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        <Input id="password" type="password" {...form.register('password')} />
        <FieldError>{form.formState.errors.password?.message}</FieldError>
      </Field>
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
      <p className="text-sm text-[var(--color-muted)]">
        Need a test user?{' '}
        <Link className="font-semibold text-[var(--color-accent)]" to="/signup">
          Create one here
        </Link>
        .
      </p>
    </Form>
  )
}
