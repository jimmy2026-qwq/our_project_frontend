import type {
  ClubSummary,
  DashboardSummary,
  PlayerLeaderboardEntry,
  PublicSchedule,
} from '@/domain';

export const workbenchMockSchedules: PublicSchedule[] = [
  {
    tournamentId: 'tournament-spring-2026',
    tournamentName: 'Riichi Nexus Spring Masters',
    tournamentStatus: 'InProgress',
    stageId: 'stage-swiss-2',
    stageName: 'Swiss Round 2',
    stageStatus: 'Active',
    scheduledAt: '2026-03-25T10:00:00+08:00',
  },
  {
    tournamentId: 'tournament-kanto-open',
    tournamentName: 'Kanto Club Open',
    tournamentStatus: 'Registration',
    stageId: 'stage-qualifier-a',
    stageName: 'Qualifier A',
    stageStatus: 'Pending',
    scheduledAt: '2026-03-28T13:30:00+08:00',
  },
];

export const workbenchMockLeaderboard: PlayerLeaderboardEntry[] = [
  {
    playerId: 'player-a',
    nickname: 'Aoi',
    clubName: 'Tokyo Drift',
    elo: 2142,
    rank: 1,
    currentRank: 'Tenhou 7-dan',
    normalizedRankScore: 710,
    status: 'Active',
  },
  {
    playerId: 'player-b',
    nickname: 'Mika',
    clubName: 'Red Dora',
    elo: 2087,
    rank: 2,
    currentRank: 'Mahjong Soul Master 2',
    normalizedRankScore: 690,
    status: 'Active',
  },
  {
    playerId: 'player-c',
    nickname: 'Ren',
    clubName: 'Quiet Riichi',
    elo: 2033,
    rank: 3,
    currentRank: 'Tenhou 6-dan',
    normalizedRankScore: 672,
    status: 'Active',
  },
];

export const workbenchMockClubs: ClubSummary[] = [
  { id: 'club-1', name: 'Tokyo Drift', memberCount: 18, powerRating: 92, treasury: 560000, relations: ['Alliance'] },
  { id: 'club-2', name: 'Red Dora', memberCount: 14, powerRating: 88, treasury: 438000, relations: ['Hostile'] },
];

export const workbenchMockDashboards: DashboardSummary[] = [
  {
    ownerId: 'player-a',
    ownerType: 'player',
    headline: 'Personal dashboard preview with ELO, recent form, and advanced metrics.',
    metrics: [
      { label: 'Composite ELO', value: '2142', accent: 'gold' },
      { label: 'Last 30 matches', value: '+118', accent: 'teal' },
      { label: 'Deal-in rate', value: '7.8%' },
    ],
  },
  {
    ownerId: 'player-b',
    ownerType: 'player',
    headline: 'The member hub can keep growing with recent matches, trends, and appeal links.',
    metrics: [
      { label: 'Composite ELO', value: '2087', accent: 'gold' },
      { label: 'Last 30 matches', value: '+63', accent: 'teal' },
      { label: 'Average place', value: '2.18' },
    ],
  },
  {
    ownerId: 'club-1',
    ownerType: 'club',
    headline: 'Club dashboards combine roster health, power rating, treasury, and public relations.',
    metrics: [
      { label: 'Club power', value: '92', accent: 'gold' },
      { label: 'Treasury', value: '560,000', accent: 'teal' },
      { label: 'Active members', value: '18' },
    ],
  },
  {
    ownerId: 'club-2',
    ownerType: 'club',
    headline: 'This area can later surface lineup readiness and alliance snapshots.',
    metrics: [
      { label: 'Club power', value: '88', accent: 'gold' },
      { label: 'Treasury', value: '438,000', accent: 'teal' },
      { label: 'Active members', value: '14' },
    ],
  },
];
