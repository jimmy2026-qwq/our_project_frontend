# Frontend Template Migration Plan

This document records the migration from the original prototype-style frontend toward the template-style architecture used in `template/frontend/`.

## 1. Goal

The migration goal remains architectural rather than cosmetic.

Target direction:

- React + TypeScript app entry
- `react-router-dom` route structure
- route pages composed from feature-level components and hooks
- shared typed client and normalization layer preserved
- API-first plus mock-fallback behavior preserved behind clearer abstractions
- gradual movement toward template-compatible shared UI and state patterns

## 2. Current Status

The core migration has been completed at the app-shell and main-route level.

Current state:

- app entry runs from `src/main.tsx`
- routing runs through React Router
- route pages exist for blueprint home, public hall, member hub, and tournament operations
- all four major business areas have React-based page composition
- legacy route adapter pages have been removed
- legacy DOM-oriented business modules have been removed
- `src/api/client.ts` and `src/domain` remain the primary shared business assets

The frontend is no longer primarily driven by manual DOM bootstrapping.

## 3. What Has Been Preserved

The following migration-critical assets were intentionally preserved:

- domain types in `src/domain`
- request and normalization logic in `src/api/client.ts`
- backend contract knowledge in `doc/DEMO_FRONTEND_API.md`
- backend contract knowledge in `doc/FRONTEND_INTERFACE_CONTRACTS.md`
- API-first plus mock-fallback strategy
- the original information architecture:
  - blueprint home
  - public hall
  - member hub
  - tournament operations

## 4. What Has Been Completed

### Phase 1: React Shell And Router

Status: completed

Completed work:

- introduced React app entry
- introduced router configuration
- introduced routed app shell
- replaced old manual app mount as the main runtime path

### Phase 2: Public Hall Migration

Status: completed

Completed work:

- moved public hall into React route pages
- split home, tournament detail, and club detail into route/page structure
- moved loading and fallback logic into feature-level data and hooks

Current implementation:

- `features/public-hall/*`
- `pages/PublicHallHomePage.tsx`
- `pages/PublicTournamentDetailPage.tsx`
- `pages/PublicClubDetailPage.tsx`

### Phase 3: Blueprint Home And Application Workbench

Status: completed

Completed work:

- homepage route is now composed through React page structure
- home club-application workbench is now a React feature
- static blueprint sections are now native React JSX components
- backend-first submit/withdraw flow is preserved
- fallback bridge remains available

Current implementation:

- `features/blueprint/*`
- `pages/BlueprintHomePage.tsx`

### Phase 4: Member Hub Migration

Status: completed

Completed work:

- moved member hub into React route/page structure
- preserved player dashboard, club dashboard, and application inbox behavior
- preserved backend-first inbox loading with fallback to local bridge state

Current implementation:

- `features/member-hub/*`
- `pages/MemberHubPage.tsx`

### Phase 5: Tournament Ops Migration

Status: completed

Completed work:

- moved tables, records, and appeals views into React route/page structure
- preserved current hard-coded tournament/stage selector context
- preserved backend-first plus mock-fallback behavior

Current implementation:

- `features/tournament-ops/*`
- `pages/TournamentOpsPage.tsx`

## 5. Cleanup Completed

The following obsolete pieces have already been removed from the main runtime path:

- legacy route adapter pages
- legacy route mount helper
- old manual app shell entry file
- old DOM-oriented business modules

Examples removed:

- `src/app.ts`
- `src/components/LegacyMount.tsx`
- `src/pages/LegacyPublicHallPage.tsx`
- `src/pages/LegacyMemberHubPage.tsx`
- `src/pages/LegacyTournamentOpsPage.tsx`
- `src/modules/public-hall.ts`
- `src/modules/guest-application.ts`
- `src/modules/member-hub.ts`
- `src/modules/tournament-ops.ts`

## 6. Remaining Technical Debt

The migration is functionally complete at the major route level, but some debt remains.

### Shared UI abstractions

Current status:

- the first shared UI layer is now in place under `src/components/shared`
- source badge, loading card, empty state, panel head, and filters head have already been extracted

Remaining issue:

- repeated filter controls, button variants, and some list/detail layout shells still duplicate across features

Recommended next step:

- keep expanding reusable shared components and lightweight shared utilities

### Styling strategy

Remaining issue:

- `src/styles/app.css` is still carrying a large portion of the visual system

Recommended next step:

- gradually extract clearer shared UI styling or move toward template-compatible styling conventions

### Backend-driven scope gaps

Remaining issue:

- managed club scope is still not fully backend-driven
- tournament/stage directory is still hard-coded in tournament operations

Recommended next step:

- close the missing backend contracts before deepening admin/operator state flows

## 7. Recommended Next Work

Recommended order from here:

1. continue expanding shared UI patterns such as filter controls, list/detail shells, and button variants
2. add richer public list/search experiences and dynamic tournament/stage directory loading
3. evaluate whether introducing Zustand/Tailwind/shadcn now provides clear leverage

## 8. Practical Conclusion

The frontend has successfully crossed the most important migration boundary.

It now behaves as a routed React application with feature-level organization across the major product surfaces. The next phase is less about replacing the old runtime architecture and more about polishing the shared component layer, tightening the styling approach, and aligning the codebase more closely with the long-term template style.
