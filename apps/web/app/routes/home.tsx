import {
  Button,
  Card,
  Container,
  SectionHeading,
  StatCard,
} from '@workspace/ui'
import { Link } from 'react-router'
import { getServerSession } from '../lib/auth.server'
import type { Route } from './+types/home'

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getServerSession(request)

  return {
    session,
  }
}

export function meta() {
  return [
    { title: 'Better Auth Lab' },
    {
      name: 'description',
      content:
        'Local Better Auth sandbox with React Router, Drizzle, and Resend.',
    },
  ]
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const session = loaderData.session

  return (
    <Container className="space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <SectionHeading
          title="A local SSR playground for Better Auth, Drizzle, Postgres, and Resend."
          description="Use this app to test the core email/password lifecycle with real server-side validation, cookie sessions, and reusable workspace UI components."
        />
        <Card className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Current state
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              {session
                ? `Signed in as ${session.user.name}`
                : 'No active session'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              {session
                ? 'Jump into the protected profile page to test session-aware UI and profile mutations.'
                : 'Create a test account or sign in to start exercising the auth flow.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {session ? (
              <Link to="/profile">
                <Button>Open profile</Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button>Create account</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary">Log in</Button>
                </Link>
              </>
            )}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          hint="SSR routes, nested layouts, and route actions"
          label="Framework"
          value="React Router"
        />
        <StatCard
          hint="Email/password tables generated from Better Auth defaults"
          label="Authentication"
          value="Better Auth + Drizzle"
        />
        <StatCard
          hint="Password reset emails with explicit error handling"
          label="Email"
          value="Resend"
        />
      </section>
    </Container>
  )
}
