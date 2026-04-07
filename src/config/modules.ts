import type { FeatureModule } from '../domain/models';

export const featureModules: FeatureModule[] = [
  {
    id: 'public-hall',
    title: 'Public Hall',
    summary:
      'Guest entry and public browsing surface for schedules, club directory, leaderboard, and public detail pages.',
    entities: ['Tournament', 'Stage', 'Club', 'Registered Player'],
    primaryRoles: ['Guest', 'RegisteredPlayer'],
    routes: ['/public', '/public/tournaments/:id', '/public/clubs/:id'],
  },
  {
    id: 'club-operations',
    title: 'Club Application Flow',
    summary:
      'Homepage application workbench that connects joinable club list, current player context, submit flow, withdraw flow, and local fallback bridge.',
    entities: ['Club', 'Registered Player', 'Club Application'],
    primaryRoles: ['RegisteredPlayer', 'ClubAdmin'],
    routes: ['GET /clubs', 'GET /players/me', 'POST /clubs/:clubId/applications'],
  },
  {
    id: 'member-hub',
    title: 'Member Hub',
    summary:
      'Read-oriented workbench for registered members and club admins, covering player dashboard, club dashboard, and club-application inbox.',
    entities: ['Player Dashboard', 'Club Dashboard', 'Club Application Inbox'],
    primaryRoles: ['RegisteredPlayer', 'ClubAdmin'],
    routes: ['/member-hub', 'GET /dashboards/players/:playerId', 'GET /clubs/:clubId/applications'],
  },
  {
    id: 'tournament-ops',
    title: 'Tournament Operations',
    summary:
      'Operations-facing surface for tables, records, and appeals. Still partially scaffold-like, but now routed through the React app shell.',
    entities: ['Tournament', 'Stage', 'Table', 'Appeal Ticket'],
    primaryRoles: ['TournamentAdmin'],
    routes: ['/tournament-ops', 'GET /tournaments/:id/stages/:stageId/tables', 'GET /appeals'],
  },
  {
    id: 'api-client',
    title: 'API Modules & Normalization',
    summary:
      'Shared API layer that is split by domain, handles fetch/json behavior, and normalizes backend payloads into frontend domain models.',
    entities: ['ListEnvelope', 'PublicSchedule', 'ClubSummary', 'TournamentPublicProfile'],
    primaryRoles: ['Guest', 'RegisteredPlayer', 'ClubAdmin', 'TournamentAdmin', 'SuperAdmin'],
    routes: ['src/api/auth.ts', 'src/api/public.ts', 'src/api/clubs.ts'],
  },
];
