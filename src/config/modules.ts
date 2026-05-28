import type { FeatureModule } from './types';

export const featureModules: FeatureModule[] = [
  {
    id: 'public-hall',
    title: 'Public Hall',
    summary:
      'Guest entry and public browsing surface for schedules, club directory, leaderboard, and public detail pages.',
    entities: ['Tournament', 'Stage', 'Club', 'Registered Player'],
    primaryRoles: ['Guest', 'RegisteredPlayer'],
    frontendRoutes: ['/public', '/public/tournaments/:id', '/public/clubs/:id'],
    apiMessages: [
      'ListPublicTournamentsAPI',
      'GetPublicTournamentAPI',
      'ListPublicClubsAPI',
      'GetPublicClubAPI',
    ],
  },
  {
    id: 'club-operations',
    title: 'Club Application Flow',
    summary:
      'Homepage application workbench that connects joinable club list, current player context, submit flow, withdraw flow, and local fallback bridge.',
    entities: ['Club', 'Registered Player', 'Club Application'],
    primaryRoles: ['RegisteredPlayer', 'ClubAdmin'],
    apiMessages: ['ListClubsAPI', 'GetCurrentPlayerAPI', 'SubmitClubApplicationAPI'],
  },
  {
    id: 'member-hub',
    title: 'Member Hub',
    summary:
      'Read-oriented workbench for registered members and club admins, covering player dashboard, club dashboard, and club-application inbox.',
    entities: ['Player Dashboard', 'Club Dashboard', 'Club Application Inbox'],
    primaryRoles: ['RegisteredPlayer', 'ClubAdmin'],
    frontendRoutes: ['/member-hub'],
    apiMessages: [
      'OpsAnalyticsPlayerDashboardAPI',
      'OpsAnalyticsClubDashboardAPI',
      'ListClubApplicationsAPI',
    ],
  },
  {
    id: 'tournament-ops',
    title: 'Tournament Operations',
    summary:
      'Operations-facing surface for tables, records, and appeals, mounted as a registered route and gated to tournament operators.',
    entities: ['Tournament', 'Stage', 'Table', 'Appeal Ticket'],
    primaryRoles: ['TournamentAdmin'],
    frontendRoutes: ['/tournament-ops'],
    apiMessages: ['TournamentListAPI', 'TournamentStageTablesAPI', 'AppealListAPI'],
  },
  {
    id: 'api-client',
    title: 'API Modules & Normalization',
    summary:
      'Shared API layer that is split by domain, handles fetch/json behavior, and normalizes backend payloads into frontend domain models.',
    entities: ['ListEnvelope', 'PublicSchedule', 'ClubSummary', 'TournamentPublicProfile'],
    primaryRoles: ['Guest', 'RegisteredPlayer', 'ClubAdmin', 'TournamentAdmin', 'SuperAdmin'],
    apiDomains: [
      'auth',
      'player',
      'club',
      'tournament',
      'opsanalytics',
      'platformadmin',
    ],
  },
];
