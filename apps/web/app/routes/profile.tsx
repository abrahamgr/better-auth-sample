import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldLabel,
  InlineMessage,
  Input,
  SectionHeading,
  StatCard,
} from '@workspace/ui'
import { APIError } from 'better-auth/api'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useSubmit,
} from 'react-router'
import { auth } from '../lib/auth.server'
import { actionFailure, toStatusCode, validateForm } from '../lib/forms.server'
import { logger } from '../lib/logger.server'
import { requireSession } from '../lib/session.server'
import { type ProfileInput, profileSchema } from '../lib/validation'
import type { Route } from './+types/profile'

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireSession(request)

  return {
    session,
  }
}

export async function action({ request }: Route.ActionArgs) {
  const session = await requireSession(request)
  const formData = await request.formData()
  const validated = validateForm({
    context: 'profile-update',
    formData,
    schema: profileSchema,
  })

  if ('error' in validated) {
    return validated.error
  }

  try {
    await auth.api.updateUser({
      body: {
        name: validated.value.name,
      },
      headers: request.headers,
    })

    logger.info({ userId: session.user.id }, 'Profile updated.')

    return data({
      fieldErrors: {},
      ok: true as const,
      successMessage: 'Profile saved.',
    })
  } catch (error) {
    if (error instanceof APIError) {
      logger.warn(
        { status: error.status, userId: session.user.id },
        'Profile update failed.',
      )
      return actionFailure(error.message, toStatusCode(error.status))
    }

    throw error
  }
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { session } = loaderData
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const isSubmitting = navigation.state === 'submitting'
  const form = useForm<ProfileInput>({
    defaultValues: {
      name: session.user.name,
    },
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (!actionData?.fieldErrors) {
      return
    }

    for (const [field, message] of Object.entries(actionData.fieldErrors)) {
      form.setError(field as keyof ProfileInput, { message })
    }
  }, [actionData, form])

  return (
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Protected route"
        title="Profile and session details"
        description="This page confirms the session cookie is active and lets you test a simple authenticated mutation."
      />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          hint="Better Auth session owner"
          label="User"
          value={session.user.name}
        />
        <StatCard
          hint="Current account email"
          label="Email"
          value={session.user.email}
        />
        <StatCard
          hint="Expires according to Better Auth session policy"
          label="Session"
          value={new Date(session.session.expiresAt).toLocaleString()}
        />
      </section>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
          <CardDescription>
            Update your display name and verify the server-side validation and
            logging path.
          </CardDescription>
        </CardHeader>
        <Form
          className="mt-6 space-y-5"
          method="post"
          onSubmit={form.handleSubmit((values) =>
            submit(values, { method: 'post' }),
          )}
        >
          {actionData && 'formError' in actionData && actionData.formError ? (
            <InlineMessage tone="danger">{actionData.formError}</InlineMessage>
          ) : null}
          {actionData && 'successMessage' in actionData ? (
            <InlineMessage tone="success">
              {actionData.successMessage}
            </InlineMessage>
          ) : null}
          <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input id="name" {...form.register('name')} />
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>
          <div className="flex justify-end">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Saving...' : 'Save profile'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
