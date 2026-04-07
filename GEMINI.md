# Gather by Hunter - Web Frontend (gbh-web)

Welcome to the `gbh-web` repository. This is the TypeScript/React frontend for the "Gather by Hunter" project. This service provides the UI and frontend logic for the platform.

## Workspace Focus

All development, maintenance, and feature implementation must be performed within the parent directory by default. The `infrastructure/` directory should only be modified when explicitly requested or when a change requires infrastructure-level updates (e.g., adding environment variables, new S3 buckets, or CloudFront configurations).

## Core Mandates

1.  **Source Control:** NEVER stage, commit, or push changes unless explicitly requested by the user.
2.  **Engineering Standards:** Rigorously adhere to existing workspace conventions and architectural patterns.
3.  **Validation:** Although tests are currently missing, they will be added in the future. For now, ensure manual verification and adherence to patterns. Empirically reproduce failures before fixing.

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Vite (Development server & Bundler)
- **Framework:** React
- **Styling:** TailwindCSS
- **Infrastructure:** Pulumi (Infrastructure as Code in TypeScript, located in `/infrastructure`)

## Architectural Patterns & Directory Structure

The project follows a strict **Model-View-Presenter (MVP)** pattern to separate concerns and improve testability.

### Directory Layout

- `src/`: The main React application.
  - `pages/`: Page-level React components.
  - `components/`: Reusable UI components.
  - `presenters/`: Coordination logic and business rules.
  - `services/`: High-level business logic and repository aggregation.
  - `repos/`: Low-level data access and API communication.
  - `model/`: Domain models and entities.
  - `api/`: Shared API communication utilities (e.g., `HttpCommunicator`).
  - `context/`: React context and global state providers.
  - `stores/`: Persistence and application state management.
- `infrastructure/`: Pulumi code for cloud resources.

### MVP Design Principles

- **View (React Components):**
  - Responsibilities: Rendering UI, managing local UI state (via React hooks), and interacting with the Presenter.
  - Views should be "thin." They define an interface (e.g., `AccountView`) that the Presenter uses to communicate back (e.g., `displayMessage`, `setUser`, `navigate`).
- **Presenter:**
  - Responsibilities: Coordination logic, handling user inputs from the View, calling Services/Repositories, and updating the View's state.
  - Presenters should NOT know about React or DOM. They interact with the View through an interface.
- **Model (Services & Repositories):**
  - **Repository:** Handles raw data persistence and retrieval (e.g., raw HTTP calls using `HttpCommunicator`). It should contain NO business logic beyond basic data transformation for the API.
  - **Service:** Contains business logic that spans multiple repositories or provides higher-level operations (e.g., handling complex associations). Services act as an abstraction over repositories.

### File Format & Import/Export Preferences

- **File types:** We only use typed files, so only TypeScript (`.ts`, `.tsx`) and no JavaScript files.
- **Module type:** We use EcmaScript modules (ESM), and so we use static imports/exports. Never use CJS `require` or `module.exports`.
- **Import/Export Preferences:**
  - When importing, we add the `.ts` file extension to the import (e.g., `import { ... } from "./index.ts"`).
  - Every folder has an `index.ts` file.
  - We re-export code using `index.ts`. We don't need to expose helper files and so we don't re-export them in `index.ts`.
  - In general, we import code from the `index.ts` file (including the `.ts` file extension in the import path!). If importing a helper file or something similar, we can import it directly from the file that declares it.
  - We prefer importing using the file paths defined in `tsconfig.json` (e.g., `@api/*`, `@model/*`, `@presenters/*`, etc.). Always import using these paths when importing across boundaries.

## Repository vs Service Usage

- **Use a Repository** when you need to interact directly with a data source or external API. It should handle low-level concerns like endpoints, request methods, and basic data transformations.
- **Use a Service** when you have logic that spans multiple repositories, requires complex business rules, or provides a shared utility that multiple presenters might need. Services act as an abstraction over repositories.

## Infrastructure

The `/infrastructure` directory contains Pulumi code for deploying the project to AWS (S3 + CloudFront). Only modify this when explicitly requested or when adding new infrastructure resources (e.g., new S3 buckets).

## Testing Standards

- Currently, the project does not have automated tests. These are planned for the future.
- When adding tests later, follow the `gbh-server` pattern of separating unit and integration tests.

## Workflow

1.  **Research:** Map the codebase and validate assumptions using `grep_search` and `read_file`.
2.  **Strategy:** Propose a plan before implementation.
3.  **Execution:** Apply surgical changes following the MVP pattern. Fulfill the entire lifecycle (implementation, validation).
4.  **Validation:** Manually verify changes in the browser. Run `npm run build` to ensure no type errors or bundling issues. Run `npm run format` to ensure code style consistency.
