import { operationsApi } from '@/api/operations';

export const heroCards = [
  {
    label: 'Migration State',
    title: 'React shell is established',
    detail:
      'The frontend has already crossed the largest migration boundary: it now boots from src/main.tsx and runs as a routed React app.',
  },
  {
    label: 'Primary Doc',
    title: '/doc/frontend-template-migration-plan.md',
    detail:
      'Tracks what is already aligned with the template architecture, what still differs, and which cleanup tasks remain.',
  },
  {
    label: 'Contracts',
    title: '/doc/FRONTEND_INTERFACE_CONTRACTS.md',
    detail:
      'Defines the backend response shapes the routed pages should keep consuming while the frontend continues to consolidate.',
  },
  {
    label: 'Current Theme',
    title: 'API first, mock safe',
    detail:
      'The active routes prefer live backend data first and fall back to mock-backed views when contracts are unavailable.',
  },
];

export const foundationLayers = [
  {
    title: 'React App Shell',
    body:
      'The runtime architecture is no longer prototype-only. The app now mounts from src/main.tsx, uses createBrowserRouter, and renders route pages inside AppShell.',
  },
  {
    title: 'Route-Oriented Pages',
    body:
      'Blueprint home, public hall, member hub, tournament operations, and public detail views now exist as routed pages instead of being stitched together by manual mount logic.',
  },
  {
    title: 'Feature-Level Organization',
    body:
      'Business logic is split into features/blueprint, features/public-hall, features/member-hub, and features/tournament-ops rather than concentrating everything in a few giant modules.',
  },
  {
    title: 'Shared Business Layer',
    body:
      'The typed domain models, modular API layer, query helpers, and club-application logic remain one of the strongest migration assets and still anchor the current frontend.',
  },
];

export const migrationTracks = [
  {
    title: 'Already in place',
    detail:
      'React root, routed pages, feature folders, shared ui primitives, shared domain shells, and root-level notice/dialog providers are all now part of the app.',
  },
  {
    title: 'Still being aligned',
    detail:
      'The largest remaining gaps are styling-system consistency, provider breadth, richer state infrastructure, and broader toolchain/template ecosystem alignment.',
  },
  {
    title: 'What must not regress',
    detail:
      'Normalization inside the domain-specific API modules remains migration-critical because backend payloads still do not map cleanly to the current frontend view models.',
  },
  {
    title: 'Why this blueprint exists',
    detail:
      'The page keeps the migrated architecture, active contracts, and route responsibilities visible in one place so cleanup work stays grounded in the current codebase.',
  },
];

export const workbenchSteps = [
  {
    title: 'Blueprint Home',
    detail: 'Explains the migrated architecture, keeps contract touchpoints visible, and hosts the current home application workbench.',
  },
  {
    title: 'Public Hall',
    detail: 'Reads public schedules, club data, and leaderboard data from routed pages with public detail views behind them.',
  },
  {
    title: 'Member Hub',
    detail: 'Keeps operator switching, player and club dashboards, and the club-application inbox inside a feature-owned workspace.',
  },
  {
    title: 'Tournament Ops',
    detail: 'Covers tables, records, and appeals while preserving the same backend-first plus mock-fallback operating pattern.',
  },
];

export const sampleRequests = [
  {
    title: 'Session bootstrap',
    description: 'Session state is expected to come from a stable frontend-facing session contract rather than ad hoc local assumptions.',
    path: '/session?operatorId=player-123',
  },
  {
    title: 'Current player context',
    description: 'The home application and member-facing flows still depend on loading the canonical player aggregate for the active operator.',
    path: '/players/me?operatorId=player-123',
  },
  {
    title: 'Club application inbox',
    description: 'Member hub and review flows depend on the stable club application inbox shape with operator scope and pending-state filters.',
    path: 'GET /clubs/:clubId/applications?operatorId=:clubAdminId&status=Pending&limit=20',
  },
  {
    title: 'Public club detail',
    description: 'Public club detail is contract-backed and includes lineup, treasury, relation, and application-policy information for public display.',
    path: '/public/clubs/:clubId',
  },
  {
    title: 'Tournament stage directory',
    description: 'Tournament operations still needs this shape to replace hard-coded stage selectors with a backend-driven directory.',
    path: '/tournaments/:id/stages',
  },
  {
    title: 'Tournament table queue',
    description: 'Tables remain one of the most valuable operational entry points in the current tournament workbench.',
    path: operationsApi.buildTournamentTablesPath('tournament-123', 'stage-demo-swiss', {
      status: 'WaitingPreparation',
      limit: 8,
    }),
  },
];

export const contractChecklist = [
  {
    title: 'Stable contract posture',
    detail:
      'The interface contracts document focuses on stable backend response shapes the next frontend iterations should preserve instead of describing an older prototype shell.',
  },
  {
    title: 'Active member write flow',
    detail:
      'The highest-value current write flow still centers on club application submit, withdraw, and admin review rather than broad CRUD coverage.',
  },
  {
    title: 'Public detail shape',
    detail:
      'Public club and tournament pages are expected to read richer detail responses than the summary lists, so detail normalization remains important.',
  },
  {
    title: 'Operations backlog',
    detail:
      'Tournament operations still needs more backend-driven context loading, but the page already mirrors the queue shapes for tables, records, and appeals.',
  },
];

export const routeDependencyBacklog = [
  {
    id: 'ops-tournament-directory',
    title: 'Tournament directory contract',
    detail: 'Tournament operations still needs GET /tournaments so the workbench can stop relying on hard-coded top-level context.',
  },
  {
    id: 'ops-stage-directory',
    title: 'Stage directory contract',
    detail: 'GET /tournaments/:id/stages is still the main missing dependency for replacing static stage selectors with backend-driven context.',
  },
  {
    id: 'operator-permissions',
    title: 'Operator permission scope',
    detail: 'A stable operator-permissions contract would let the routed workbenches express capability scope without treating every route as globally writable.',
  },
];
