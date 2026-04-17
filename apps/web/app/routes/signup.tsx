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
import { type SignUpInput, signUpSchema } from '../lib/validation'
import type { Route } from './+types/signup'

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
    context: 'signup',
    formData,
    schema: signUpSchema,
  })

  if ('error' in validated) {
    return validated.error
  }

  try {
    const { headers } = await auth.api.signUpEmail({
      body: validated.value,
      headers: request.headers,
      returnHeaders: true,
    })

    logger.info({ email: validated.value.email }, 'User signed up.')

    return redirect('/profile', {
      headers: mergeHeaders(headers),
    })
  } catch (error) {
    if (error instanceof APIError) {
      logger.warn(
        { email: validated.value.email, status: error.status },
        'Sign-up failed.',
      )
      return actionFailure(error.message, toStatusCode(error.status))
    }

    throw error
  }
}

export default function SignUp() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const isSubmitting = navigation.state === 'submitting'
  const form = useForm<SignUpInput>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
    resolver: zodResolver(signUpSchema),
  })

  useEffect(() => {
    if (!actionData?.fieldErrors) {
      return
    }

    for (const [field, message] of Object.entries(actionData.fieldErrors)) {
      form.setError(field as keyof SignUpInput, { message })
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
        <FieldLabel htmlFor="name">Full name</FieldLabel>
        <Input id="name" placeholder="Ava Cooper" {...form.register('name')} />
        <FieldError>{form.formState.errors.name?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          placeholder="ava@example.com"
          {...form.register('email')}
        />
        <FieldError>{form.formState.errors.email?.message}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input id="password" type="password" {...form.register('password')} />
        <FieldError>{form.formState.errors.password?.message}</FieldError>
      </Field>
      <Button className="w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
      <p className="text-sm text-[var(--color-muted)]">
        Already registered?{' '}
        <Link className="font-semibold text-[var(--color-accent)]" to="/login">
          Log in
        </Link>
        .
      </p>
    </Form>
  )
}
