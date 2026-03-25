import type { ClubSummary, DashboardSummary, PlayerLeaderboardEntry, PublicSchedule } from '../domain/models';

export const mockSchedules: PublicSchedule[] = [
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

export const mockLeaderboard: PlayerLeaderboardEntry[] = [
  { playerId: 'player-a', nickname: 'Aoi', clubName: 'Tokyo Drift', elo: 2142, rank: 1, status: 'Active' },
  { playerId: 'player-b', nickname: 'Mika', clubName: 'Red Dora', elo: 2087, rank: 2, status: 'Active' },
  { playerId: 'player-c', nickname: 'Ren', clubName: 'Quiet Riichi', elo: 2033, rank: 3, status: 'Active' },
];

export const mockClubs: ClubSummary[] = [
  { id: 'club-1', name: 'Tokyo Drift', memberCount: 18, powerRating: 92, treasury: 560000, relations: ['Alliance'] },
  { id: 'club-2', name: 'Red Dora', memberCount: 14, powerRating: 88, treasury: 438000, relations: ['Hostile'] },
];

export const mockDashboards: DashboardSummary[] = [
  {
    ownerId: 'player-a',
    ownerType: 'player',
    headline: '个人面板会承接 ELO、对局轨迹和高阶统计摘要。',
    metrics: [
      { label: '综合 ELO', value: '2142', accent: 'gold' },
      { label: '最近 30 战', value: '+118', accent: 'teal' },
      { label: '防守铳率', value: '7.8%' },
    ],
  },
  {
    ownerId: 'club-1',
    ownerType: 'club',
    headline: '俱乐部面板会组合成员状态、战力评分、资金池和对外关系。',
    metrics: [
      { label: '俱乐部战力', value: '92', accent: 'gold' },
      { label: '资金库', value: '560,000', accent: 'teal' },
      { label: '活跃成员', value: '18' },
    ],
  },
];

