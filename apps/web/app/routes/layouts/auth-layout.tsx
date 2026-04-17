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
