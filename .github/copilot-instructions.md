# Copilot Instructions for Skill-Connect-Backend

## Project Overview
- **Type:** Node.js backend (TypeScript)
- **Main entry:** `src/server.ts`
- **Purpose:** Backend for Skill-Connect platform, handling users, projects, and tasks.
- **Key frameworks:** Express, Mongoose, Prisma, Zod, JWT, Stripe, Winston

## Architecture & Structure
- **src/app/modules/**: Domain modules (`user`, `project`, `task`) each with `controller.ts`, `service.ts`, `model.ts`, `routes.ts`.
- **src/app/middlewares/**: Custom middlewares (auth, error handling, validation).
- **src/app/routes/index.ts**: Aggregates all module routes.
- **src/config/**: App configuration (env, DB, etc).
- **src/helpers/**: Utility helpers (JWT, password, pagination).
- **src/errors/**: Custom error classes and Zod error handler.
- **src/shared/**: Async handler, response formatting, field picking.
- **scripts/**: Utility scripts for verifying DB connections (`verify-mongoose.ts`, `verify-prisma.ts`).

## Developer Workflows
- **Start (dev):** `yarn start` (uses `ts-node-dev`)
- **Lint & Format:**
  - Lint: `yarn lint:check` / Fix: `yarn lint:fix`
  - Prettier: `yarn prettier:check` / Fix: `yarn prettier:fix`
  - Combined: `yarn lint-prettier`
- **Postinstall:** Runs `prisma generate` (ensure Prisma client is up-to-date)
- **Testing:** No tests defined yet (see `package.json`)

## Patterns & Conventions
- **Controllers**: Only handle HTTP request/response, delegate logic to services.
- **Services**: Contain business logic, interact with models.
- **Models**: Mongoose schemas for MongoDB collections.
- **Routes**: Each module exposes its own router, aggregated in `src/app/routes/index.ts`.
- **Error Handling**: Use `ApiError` and `globalErrorHandler` middleware. Zod validation errors handled in `handleZodError.ts`.
- **Async Handling**: Use `catchAsync.ts` to wrap async route handlers.
- **Response**: Use `sendResponse.ts` for consistent API responses.
- **Validation**: Use Zod schemas for request validation.

## Integration Points
- **MongoDB**: via Mongoose
- **Prisma**: (likely for SQL, see `verify-prisma.ts`)
- **Stripe**: Payment integration
- **JWT**: Auth via `jwtHelpers.ts`
- **Winston**: Logging

## Examples
- Add a new domain: Copy a module folder (e.g., `project/`), update model, service, controller, and routes.
- Add middleware: Place in `middlewares/`, register in `app.ts`.
- Add helper: Place in `helpers/`, import as needed.

## See Also
- `package.json` for scripts and dependencies
- `src/app.ts` for app setup and middleware registration
- `src/server.ts` for server bootstrap
- `src/app/routes/index.ts` for route aggregation

---
_Keep this file concise and actionable. Update as project structure or conventions evolve._
