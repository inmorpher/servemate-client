# Gemini Instructions for servemate-client

This document provides instructions for Gemini to effectively assist with the development of the `servemate-client` project.

## Project Overview

`servemate-client` is a Next.js application written in TypeScript. It uses Tailwind CSS for styling and TanStack Query for data fetching. Authentication is handled by `next-auth` and `iron-session`.

## Key Technologies

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching:** TanStack Query, Axios
- **Authentication:** `next-auth`, `iron-session`
- **Linting:** ESLint
- **Formatting:** Prettier

## Development

### Running the development server

To start the development server, run the following command:

```bash
npm run dev
```

This will start the server with Turbopack on `http://localhost:3000`.

### Building the application

To build the application for production, run:

```bash
npm run build
```

### Starting the production server

To start a production server, run:

```bash
npm run start
```

### Linting

To check for linting errors, run:

```bash
npm run lint
```

## Code Structure

The application code is located in the `src` directory.

- `src/app`: Contains the pages and layouts of the application.
- `src/features`: Contains the different features of the application, such as authentication, orders, and users. Each feature has its own directory with hooks, models, UI components, and utilities.
- `src/shared`: Contains shared components, hooks, layouts, and utilities that are used across multiple features.
- `src/lib`: Contains library code, such as session management.
- `src/providers`: Contains React context providers.

## Conventions

- Use the existing code as a reference for styling and code structure.
- Follow the project's linting and formatting rules.
- When adding new features, follow the existing feature structure.

## Architecture

### Authentication Flow

Authentication is managed using a combination of `next-auth` and `iron-session`.

1.  **Login Process**: The user submits their credentials via the `LoginForm` component. The `login` server action in `src/features/auth/api/login.ts` sends a POST request to the external backend authentication endpoint (`/api/auth/login`).
2.  **Session Management**: Upon successful authentication, the backend returns a JWT access token and a refresh token. These tokens, along with user information and token expiration time, are stored in a session managed by `iron-session`. The session data is stored in an encrypted cookie.
3.  **Route Protection**: The `middleware.ts` file intercepts requests to protected routes. It checks for the existence of a valid session and ensures the access token is not expired. If the user is not authenticated or the token is expired, they are redirected to the `/login` page.

### API Proxy

The application uses a generic API proxy to communicate with the backend service.

-   **Proxy Route**: The route handler at `src/app/api/service/[...params]/route.ts` catches all requests made to `/api/service/*`.
-   **Request Forwarding**: It forwards the request to the corresponding backend service endpoint.
-   **Authentication**: Before forwarding, it retrieves the access token from the user's session and adds it to the `Authorization` header of the outgoing request. This ensures that all communication with the backend is authenticated.
-   **Configuration**: The `serviceConfig` object in `src/app/api/service/[...params]/config.ts` defines which query parameters are allowed for different HTTP methods, providing a layer of security.

### Data Fetching

Client-side data fetching is handled by `TanStack Query`.

-   **Custom Hooks**: Data fetching logic is encapsulated in custom hooks, such as `useGetOrders` in `src/features/orders/hooks/useGetOrders.ts`.
-   **Querying**: These hooks use `TanStack Query`'s `useQuery` to fetch data from the internal API proxy (`/api/service/...`). They construct a unique query key based on the current search and filter criteria.
-   **State Management**: The hooks also manage the component's state, such as search criteria, which are read from and written to the URL's query parameters. This allows for bookmarkable and shareable URLs.
-   **Declarative Approach**: This setup provides a clean, declarative way to fetch, cache, and manage server state in the application.
