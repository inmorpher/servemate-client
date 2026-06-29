# ServeMate client instructions

## What this workspace is

This repository is the Next.js 15 client for ServeMate. The app uses the App Router, React Query, Zustand, Tailwind, and a shared proxy layer for backend calls.

## Working conventions

- Keep feature-specific code under [src/features](src/features) and reusable primitives under [src/shared](src/shared).
- Prefer existing shared hooks, components, and utilities before introducing new ones.
- Avoid `any`; use precise TypeScript types and shared DTOs from `@servemate/dto`.
- Keep UI components presentational and move business logic into hooks or utilities.

## API and data fetching

- Use the proxy pattern for backend requests. Build URLs through [src/consts.ts](src/consts.ts) and the helper in [src/shared/utils/buildApiUrl.ts](src/shared/utils/buildApiUrl.ts) rather than calling the backend directly.
- Route requests through the service proxy in [src/app/api/service](src/app/api/service) so auth/session handling stays centralized.
- For list/search flows, prefer the existing domain hooks and React Query patterns over ad-hoc fetch logic.
- When URL query state is involved, use the existing search helpers and Zod-based parsing instead of manual `searchParams` handling.

## Auth and session

- Authentication and session handling live around [src/app/lib](src/app/lib) and the auth feature under [src/features/auth](src/features/auth).
- If a change touches protected routes, session refresh, or auth redirects, inspect those areas before editing.

## Project structure to follow

- [src/app](src/app): route entry points, layouts, and app-level providers.
- [src/features](src/features): domain-focused UI, hooks, and API clients.
- [src/shared](src/shared): reusable layout, form, table, hook, and utility code.
- [src/consts.ts](src/consts.ts): centralized API endpoints and shared constants.

## Commands

- `npm run dev`
- `npm run build`
- `npm run lint`

## Documentation to consult

- [README.md](README.md)
- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)
- [DEV_NOTES/SEARCH_CRITERIA.md](DEV_NOTES/SEARCH_CRITERIA.md)

## Common pitfalls

- Do not bypass the API proxy with direct backend URLs.
- Do not duplicate DTOs or API response shapes when `@servemate/dto` already exposes them.
- Do not mix local filter persistence and URL-driven search state for the same flow unless the existing pattern explicitly requires it.

## Working modes

- In Ask mode, act as a senior developer mentor: explain the problem, inspect the relevant code, and provide a clear reasoning-based answer with implementation options and trade-offs.
- In Agent mode, you may make code changes when requested, following the project conventions above and keeping changes scoped and intentional.
- This is a learning project, so explanations should be educational: prefer showing why a solution is appropriate, what trade-offs exist, and how it fits the existing architecture.
- When answering in Ask mode, focus on reasoning, context, and alternatives rather than just giving a quick fix.
