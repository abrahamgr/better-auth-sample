import './app.css'

import { Button, Container, cn } from '@workspace/ui'
import type { PropsWithChildren } from 'react'
import {
  Form,
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useRouteLoaderData,
} from 'react-router'

import type { Route } from './+types/root'
import { getServerSession } from './lib/auth.server'

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getServerSession(request)

  return {
    session,
  }
}

export function Layout({ children }: PropsWithChildren) {
  return (
    <html className="h-full" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-full antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function RootChrome() {
  const data = useRouteLoaderData<typeof loader>('root')
  const navigation = useNavigation()
  const session = data?.session ?? null
  const isBusy = navigation.state !== 'idle'

  return (
    <div className="relative min-h-screen">
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-1 origin-left bg-[var(--color-accent)] transition-transform duration-300',
          isBusy ? 'scale-x-100' : 'scale-x-0',
        )}
      />
      <header className="sticky top-0 z-40 border-b border-white/40 bg-[color-mix(in_oklab,var(--color-surface)_78%,white)] backdrop-blur">
        <Container className="flex items-center justify-between gap-6 py-4">
          <div className="flex items-center gap-6">
            <NavLink className="text-lg font-semibold tracking-tight" to="/">
              Better Auth Lab
            </NavLink>
            <nav className="hidden items-center gap-4 text-sm text-[var(--color-muted)] sm:flex">
              <NavLink
                className={({ isActive }) =>
                  cn(
                    'transition hover:text-[var(--color-ink)]',
                    isActive && 'text-[var(--color-ink)]',
                  )
                }
                to="/"
              >
                Home
              </NavLink>
              {session ? (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      'transition hover:text-[var(--color-ink)]',
                      isActive && 'text-[var(--color-ink)]',
                    )
                  }
                  to="/profile"
                >
                  Profile
                </NavLink>
              ) : null}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {session.user.email}
                  </p>
                </div>
                <Form action="/logout" method="post">
                  <Button type="submit" variant="secondary">
                    Log out
                  </Button>
                </Form>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  {({ isActive }) => (
                    <Button
                      className={cn(
                        isActive && 'ring-2 ring-[var(--color-accent)]',
                      )}
                      variant="ghost"
                    >
                      Log in
                    </Button>
                  )}
                </NavLink>
                <NavLink to="/signup">
                  <Button>Start testing</Button>
                </NavLink>
              </>
            )}
          </div>
        </Container>
      </header>
      <main className="pb-16 pt-10">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return <RootChrome />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = 'Something went wrong'
  let message = 'The page could not be rendered.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message =
      typeof error.data === 'string'
        ? error.data
        : 'A route response error prevented the page from loading.'
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <Layout>
      <Container className="py-20">
        <div className="max-w-xl rounded-[2rem] border border-[var(--color-border)] bg-white/80 p-8 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Application error
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-3 text-[var(--color-muted)]">{message}</p>
        </div>
      </Container>
    </Layout>
  )
}
