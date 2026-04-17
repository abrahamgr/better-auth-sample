import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from '@workspace/ui'
import { Link, Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <Container className="grid min-h-[calc(100vh-10rem)] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
          Local auth sandbox
        </p>
        <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Validate the full Better Auth email and password flow in one place.
        </h1>
        <p className="max-w-xl text-base leading-7 text-[var(--color-muted)]">
          This sandbox uses SSR React Router routes, typed server validation,
          persistent Postgres, and Resend-backed password recovery.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <p className="text-sm font-semibold">Server-first auth routes</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Forms validate on the client with React Hook Form and again on the
              server with Zod.
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-semibold">Persistent local database</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Docker Compose keeps your Postgres data alive across restarts for
              repeatable testing.
            </p>
          </Card>
        </div>
      </section>
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle>Account access</CardTitle>
          <CardDescription>
            Create a test user, sign in, request resets, and inspect behavior
            end to end.
          </CardDescription>
        </CardHeader>
        <div className="mt-6">
          <Outlet />
        </div>
        <p className="mt-6 text-sm text-[var(--color-muted)]">
          Need context first?{' '}
          <Link className="font-semibold text-[var(--color-accent)]" to="/">
            Go back home
          </Link>
          .
        </p>
      </Card>
    </Container>
  )
}
