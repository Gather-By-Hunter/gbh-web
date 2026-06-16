# Gather by Hunter Web

TypeScript/React frontend for Gather by Hunter, an event decor rental app. The app lets customers browse public rental/home content and gives admins workflows for managing rental models, media, and home-page featured media.

## Stack

- TypeScript
- React
- Vite
- TailwindCSS
- React Router
- pnpm
- Pulumi TypeScript infrastructure under `infrastructure/`

## Architecture

The frontend follows a Model-View-Presenter style:

- `src/pages/`: route-level React views
- `src/components/`: reusable view components
- `src/presenters/`: workflow coordination and user-action logic
- `src/services/`: business logic across repos
- `src/repos/`: low-level API adapters
- `src/model/`: frontend domain models
- `src/stores/`: app state and persistence caches
- `src/context/`: dependency composition and React providers

React components should stay view-focused. Presenters coordinate workflows and call services. Services own cross-repository behavior. Repos map backend endpoints and response shapes.

## Backend Contract

The frontend talks to the TypeScript `gbh-server` backend through the API base URL configured by `VITE_API_BASE_URL`.

Authentication is cookie-based. API requests are sent with credentials included; frontend persistence is only a UI cache for the current user, not an auth-token source of truth.

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm exec tsc --noEmit
pnpm format
```

## Infrastructure

The `infrastructure/` directory contains the Pulumi TypeScript project for static hosting resources such as S3, CloudFront, DNS, and certificate wiring.

Use previews before deployment:

```bash
cd infrastructure
pnpm install
pulumi preview
```

Do not run `pulumi up` unless you intend to deploy changes.
