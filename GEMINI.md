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
