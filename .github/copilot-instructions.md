# ServeMate client instructions

## What this workspace is

This repository is the Next.js 16 client for ServeMate. The app uses the App Router, React 19, TanStack Query, Zustand, Tailwind CSS, and a shared proxy layer for backend calls.

## Project structure to follow

- [src/app](src/app): route entry points, layouts, providers, and app-level auth/session handling.
- [src/features](src/features): domain-focused UI, hooks, stores, and API clients.
- [src/shared](src/shared): reusable components, hooks, layouts, utilities, and UI primitives.
- [src/consts.ts](src/consts.ts): central API endpoint definitions and shared constants.

## Working conventions

- Prefer existing shared hooks, UI primitives, and utilities before introducing new abstractions.
- Keep UI components presentational and move business logic into hooks, stores, or utilities.
- Use precise TypeScript types and shared DTOs from `@servemate/dto` instead of `any` or duplicating response shapes.
- Keep changes scoped to the relevant feature and avoid mixing unrelated concerns.

## API and data fetching

- Route backend requests through the proxy layer in [src/app/api/service](src/app/api/service) rather than calling the backend directly.
- Build request URLs via [src/consts.ts](src/consts.ts) and [src/shared/utils/buildApiUrl.ts](src/shared/utils/buildApiUrl.ts).
- Reuse the existing query/mutation hooks and list/search patterns in [src/features](src/features) before adding ad-hoc fetch logic.
- For URL-driven search state, follow the existing search helpers and Zod-based parsing patterns rather than manual `searchParams` handling.

## Auth and session

- Authentication and session handling live around [src/app/lib](src/app/lib) and the auth feature in [src/features/auth](src/features/auth).
- If a change touches protected routes, session refresh, redirects, or auth state, inspect those areas before editing.
- Preserve the current session flow in [src/app/lib/session.ts](src/app/lib/session.ts) and [src/app/lib/session-update.ts](src/app/lib/session-update.ts).

## Commands

- Use the workspace package manager lockfile and prefer `pnpm` for installs and verification.
- Common checks: `pnpm lint` and `pnpm build`.
- For local development: `pnpm dev`.

## Documentation to consult

- [README.md](README.md)
- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)
- [DEV_NOTES/SEARCH_CRITERIA.md](DEV_NOTES/SEARCH_CRITERIA.md)

## Common pitfalls

- Do not bypass the API proxy with direct backend URLs.
- Do not duplicate DTOs or API response shapes when `@servemate/dto` already exposes them.
- Do not mix local filter persistence and URL-driven search state for the same flow unless the existing pattern already does so.
