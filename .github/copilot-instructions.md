# ServeMate Copilot Instructions

## Architecture Overview

ServeMate is a full-stack restaurant management system with:

- **Frontend**: Next.js 15 client (`servemate-client`) with App Router, TypeScript, TailwindCSS
- **Backend**: Express.js service (`ServeMate-service`) with TypeScript, Prisma ORM, PostgreSQL
- **Shared**: `@servemate/dto` workspace package for type-safe API contracts

## Key Architectural Patterns

### Frontend Structure (Feature-Sliced Design)

```
src/
├── app/                 # Next.js App Router pages
├── features/           # Domain-specific features (auth, orders, users)
│   └── [feature]/
│       ├── api/        # API client functions
│       ├── hooks/      # React hooks
│       ├── ui/         # UI components
│       └── utils/      # Feature utilities
├── shared/             # Reusable components, hooks, utils
├── providers/          # React context providers
└── types/              # Global TypeScript types
```

### Backend Structure (Clean Architecture + DI)

```
src/
├── app.ts              # Express app setup with InversifyJS
├── controllers/        # HTTP controllers with decorators
├── services/           # Business logic services
├── middleware/         # Express middlewares
├── decorators/         # Custom HTTP route decorators
└── types.ts            # DI container symbols
```

## Essential Development Patterns

### API Proxy Pattern

The client uses `/api/service/[...params]` to proxy all API calls to the backend service, handling authentication tokens automatically. Always use this pattern instead of direct fetch to backend URLs.

### Component Architecture

- Use Feature-Sliced Design: organize by domain features, not technical layers
- Components in `features/[domain]/ui/` for domain-specific UI
- Shared components in `src/shared/components/`
- Export pattern: create `index.ts` files for clean imports

### Backend Controllers

Use custom decorators for clean API definitions:

```typescript
@injectable()
@Controller('/users')
export class UserController extends BaseController {
	@Get('/profile')
	@UseMiddleware(authMiddleware)
	async getProfile(req: Request, res: Response) {
		// implementation
	}
}
```

### Styling System

- **Catppuccin Mocha** color palette (see `tailwind.config.ts`)
- Use `cn()` utility from `shared/lib/classNames.ts` for conditional classes
- Color variables: `ctp-base`, `ctp-blue`, `ctp-mauve`, etc.

## Critical Development Commands

### Client Development

```bash
# Development with Turbopack (faster)
npm run dev

# Type checking and linting
npm run lint
```

### Service Development

```bash
# Development with nodemon
npm run dev

# Database operations
npx prisma migrate dev --name [description]
npx prisma generate
npx prisma studio

# Production build
npm run build
npm run start:prod  # PM2 production
```

### DTO Package

The shared DTO package is automatically built when service starts. Regenerate with:

```bash
npm run generate-dto
```

## Authentication Flow

1. Login through `/api/auth/` endpoint (client)
2. Tokens stored in iron-session (server-side)
3. Middleware validates tokens on protected routes
4. API proxy automatically includes tokens in service requests

## State Management

- **React Query** (`@tanstack/react-query`) for server state
- Local component state with `useState`
- Global providers in `src/providers/`

## Database Patterns

- Prisma ORM with PostgreSQL
- Schema in `prisma/schema.prisma`
- Use dependency injection for PrismaClient in services
- Generate types with custom DTO generator

## Common Anti-Patterns to Avoid

- ❌ Direct fetch calls to backend URLs (use API proxy)
- ❌ Mixing business logic in components (use hooks/services)
- ❌ Manual token handling (handled by middleware)
- ❌ Direct Prisma usage in controllers (use services)
- ❌ Generic utility functions in feature folders

## File Creation Guidelines

- New features: create in `features/[domain]/` with `ui/`, `hooks/`, `api/` structure
- Shared components: use `shared/components/[component]/` with index exports
- Backend endpoints: extend existing controllers or create new ones with proper DI
- Always include TypeScript types from `@servemate/dto` package
