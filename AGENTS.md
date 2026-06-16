# Gather by Hunter - Web Frontend (`gbh-web`)

This repository contains the TypeScript/React frontend for Gather by Hunter. It uses Vite, TailwindCSS, React Router, and supporting Pulumi infrastructure under `infrastructure/`.

Also read the parent workspace guidance at `../AGENTS.md`.

## Core Mandates

1. **Source Control:** Never stage, commit, or push changes unless explicitly requested.
2. **Engineering Standards:** Follow existing workspace conventions and architectural patterns.
3. **Type Safety:** Never use `any` or `unknown` unless absolutely necessary. Ask for permission and justify it first.
4. **Explicit Types:** Prefer explicit named interfaces/types over `ReturnType`, `Parameters`, or similar utility types when a clear local type can be defined.
5. **Mandatory Verification:** Run type/build validation before saying frontend work is complete, unless a clear blocker prevents it.

## Workspace Focus

Application work should happen in the repository root by default. The `infrastructure/` directory should only be modified when explicitly requested or when the feature requires infrastructure changes.

## Tech Stack

- **Language:** TypeScript
- **Framework:** React
- **Runtime/Bundler:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router
- **Infrastructure:** Pulumi TypeScript under `infrastructure/`

## Architecture

The app follows a Model-View-Presenter pattern.

- `src/pages/`: Page-level React components and route views.
- `src/components/`: Reusable UI components.
- `src/presenters/`: Coordination logic, user-action handling, and view updates.
- `src/services/`: Higher-level business logic across repositories.
- `src/repos/`: Low-level API/data access and response mapping.
- `src/model/`: Domain models and entities.
- `src/api/`: Shared API communication utilities.
- `src/context/`: React context and global providers.
- `src/stores/`: Persistence and application state management.
- `infrastructure/`: Pulumi code for S3/CloudFront/static hosting resources.

## MVP Rules

- React components should be thin views. Keep rendering and local UI state in components.
- Presenters coordinate behavior and call services/repositories. They must not depend on React or the DOM.
- Repositories should perform low-level data access/API mapping only.
- Services should own business behavior that spans multiple repositories or domains.
- Search existing presenters, services, repos, and models before introducing new ones.

## Module System & Imports

- TypeScript only. Do not add JavaScript files.
- Use static ESM imports/exports. Do not use CommonJS `require`.
- Always include `.ts` or `.tsx` extensions in local imports.
- Every folder should expose public API through `index.ts` where that pattern already exists.
- Prefer path aliases from `tsconfig.json` for cross-directory imports:
  - `@api/*`
  - `@components/*`
  - `@context/*`
  - `@model/*`
  - `@pages/*`
  - `@presenters/*`
  - `@repos/*`
  - `@services/*`
  - `@stores/*`

## UI Guidelines

- Match the existing Gather by Hunter visual style.
- Use existing components before creating new component patterns.
- Use `lucide-react` icons where appropriate.
- Keep components responsive and verify that text does not overflow at mobile and desktop widths.
- For meaningful UI changes, run the app and verify in a browser when feasible.

## Commands

- `npx pnpm@11.4.0 dev`: Start the Vite dev server.
- `npx pnpm@11.4.0 build`: Typecheck and build the app.
- `npx pnpm@11.4.0 exec tsc --noEmit`: Typecheck only.
- `npx pnpm@11.4.0 format`: Format the repository.

## Validation

Before saying frontend work is complete:

- Run `npx pnpm@11.4.0 build` when practical.
- Run targeted manual/browser verification for UI changes.
- Run `npx pnpm@11.4.0 format` when formatting may have changed.

If a check cannot be run, report the reason clearly.
