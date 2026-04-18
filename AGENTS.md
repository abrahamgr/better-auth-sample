# Repository Guidelines

## Project Structure & Module Organization
This repo is a `pnpm` workspace with one app and one shared package. `apps/web` contains the React Router application: route modules live in `app/routes`, layout wrappers live in `app/routes/layouts`, and server-only code uses the `*.server.ts` suffix in `app/lib`. Database schema and migrations live in `apps/web/drizzle` with config in `apps/web/drizzle.config.ts`. Shared UI primitives live in `packages/ui/src`.

## Build, Test, and Development Commands
Use `pnpm install` to set up the workspace. `pnpm dev` starts the web app on `http://localhost:3000`. `pnpm build` creates the production build, and `pnpm start` serves it. `pnpm lint` runs Biome checks across the repo, while `pnpm check` applies Biome fixes. `pnpm typecheck` runs React Router type generation and TypeScript checks.

For local services, `pnpm db:up` starts Postgres and Mailpit with Docker, `pnpm db:down` stops them, and `pnpm db:logs` tails Postgres logs. Use `pnpm --filter=./apps/web run db:generate` and `pnpm --filter=./apps/web run db:migrate` for Drizzle changes. Run `pnpm --filter=./apps/web run auth:generate` after Better Auth schema updates.

## Coding Style & Naming Conventions
The codebase uses TypeScript ESM with Biome enforcing 2-space indentation, single quotes, no semicolons, and trailing commas. Keep route files URL-aligned and kebab-case, for example `forgot-password.tsx`. Export React components and types in PascalCase. Keep server-only utilities in `*.server.ts` files such as `env.server.ts` and `db/index.server.ts`. Prefer shared components from `@workspace/ui` before adding duplicate UI.

## Testing Guidelines
There is no committed automated test suite yet. Before opening a PR, run `pnpm lint` and `pnpm typecheck`, then manually verify the auth flows: sign up, log in, forgot password, reset password, and profile updates. Use Mailpit at `http://localhost:8025` to inspect local emails. If you add tests, place `*.test.ts` or `*.test.tsx` files next to the feature they cover.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commits such as `feat:`, `fix:`, `refactor:`, and `chore:`. Keep commit subjects short, imperative, and scoped to one change. PRs should explain the user-visible impact, call out required env or migration steps, link related issues, and include screenshots for UI changes.

## Security & Configuration Tips
Runtime config is validated in `apps/web/app/lib/env.server.ts`. Do not commit real secrets; override defaults locally with environment variables. Outside local development, use a strong `BETTER_AUTH_SECRET`, and keep `DATABASE_URL`, SMTP settings, and `RESEND_API_KEY` environment-specific.
