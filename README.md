# better-auth-sample

A small local sandbox for Better Auth with React Router, Drizzle, Postgres, and Resend-style email flows. It covers the core email/password lifecycle: sign up, log in, forgot password, reset password, and a protected profile page.

## Quick start

```bash
cp apps/web/.env.sample apps/web/.env
# Edit apps/web/.env — at minimum set BETTER_AUTH_SECRET to a strong random value:
#   openssl rand -base64 32
pnpm install
pnpm db:up
pnpm dev
```

The app runs at `http://localhost:3000`. Local email testing is available in Mailpit at `http://localhost:8025`.

## Useful commands

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Database and auth helpers for the web app:

```bash
pnpm --filter=./apps/web run db:generate
pnpm --filter=./apps/web run db:migrate
```
