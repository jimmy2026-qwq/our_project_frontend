# Frontend Architecture

This document describes the frontend as it exists today under `front/src`.

## Current Shape

The frontend is a routed React application mounted from `front/src/main.tsx` and driven by `createBrowserRouter` in `front/src/router.tsx`.

Current top-level structure under `front/src`:

- `api/`
- `app/`
- `components/`
- `config/`
- `domain/`
- `features/`
- `hooks/`
- `lib/`
- `modules/`
- `pages/`
- `providers/`
- `styles/`

This is no longer a prototype shell and it is no longer especially close to the template's lighter directory layout. It is now a fuller app-specific structure.

## Current Route Map

Mounted routes today:

- `/login`
- `/register`
- `/public`
- `/public/tournaments/:tournamentId`
- `/public/clubs/:clubId`
- `/blueprint`
- `/me`
- `/tables/:tableId`
- `/tables/:tableId/paifu`

Routing notes:

- `/` redirects to `/public`
- most app routes sit under `AppShell`
- the app uses `RequireAuth` for authenticated access
- `RequireRegisteredUser` protects registered-user-only routes such as `/blueprint`, `/member-hub`, `/me`, `/tournament-ops`, and table pages

Mounted registered-user workspaces now include:

- `/member-hub`
- `/tournament-ops`

## Feature Organization

Main feature directories:

- `features/auth`
- `features/blueprint`
- `features/member-hub`
- `features/public-hall`
- `features/tournament-ops`

How to read them:

- `public-hall` is the most clearly mounted public-facing area
- `blueprint` is the registered-user workbench and project-facing demonstration surface
- `member-hub` and `tournament-ops` now have mounted route entrypoints and still retain deeper feature-level logic under their own directories

## API Layer

The API layer lives under `front/src/api`.

Current key pieces:

- `auth.ts`
- `clubs.ts`
- `operations.ts`
- `public.ts`
- `contracts/*`
- `http.ts`
- feature-specific mapper files such as `public.mappers.ts`

Current contract direction:

- frontend-facing transport contracts live in `api/contracts/*`
- feature code should consume contracts through API modules and mappers
- feature-local duplicate contract types have largely been removed from `public-hall`

Current structural gap:

- `operations.ts` is still too broad and should eventually be split by capability

## UI Layering

The UI layer is clearer than it was in the earlier migration phase.

Current reusable layers:

- `components/ui/`
  - low-level primitives
- `components/shared/layout`
  - layout-oriented wrappers
- `components/shared/feedback`
  - loading, empty, warning, and source presentation
- `components/shared/data-display`
  - summary, metadata, and detail display shells
- `components/shared/domain`
  - domain-aware reusable presentation
- `components/shared/forms`
  - shared form wrappers and field composition

This means feature pages are increasingly composition-oriented rather than raw-markup-heavy.

## Data Strategy

The frontend is still API-first, but some areas keep local fallback or bridge behavior so the UI remains usable during partial backend failure.

That fallback strategy no longer lives in a single `mocks/` directory.

Instead, fallback behavior is now spread across:

- feature-local fallback builders
- local bridge helpers in `lib/`
- shared notice hooks that can surface partial-success states

Important correction from older docs:

- `front/src/mocks/` is no longer part of the current source layout

## Backend Alignment

The frontend now talks to a backend whose internal structure has moved to:

- `riichinexus.api`
- `riichinexus.application`
- `riichinexus.bootstrap`
- `riichinexus.domain`
- `riichinexus.infrastructure`

That matters for documentation because older notes that reference the previous top-level bridge layers are now out of date.

## What Still Needs Cleanup

The main architecture work left is not a big framework migration. It is mostly boundary cleanup:

- split oversized API modules, especially `operations.ts`
- keep transport compatibility helpers away from business-facing feature code
- narrow `api/client.ts` so runtime exports and contract exports are less mixed
- continue shrinking broad global styling in `styles/app.css`

## What Should Be Preserved

These parts are now stable enough to treat as intentional architecture:

- router-driven app shell
- API contracts plus mapper boundary under `front/src/api`
- feature-based page composition
- shared UI layers under `components/shared`
- provider and hook based notice/dialog infrastructure
- the current public hall, blueprint, player dashboard, and table workflow surfaces
