import type {
  AppealSummary,
  ClubPublicProfile,
  ClubSummary,
  DashboardSummary,
  ListEnvelope,
  MatchRecordSummary,
  PlayerLeaderboardEntry,
  PublicSchedule,
  TournamentPublicProfile,
  TournamentTableSummary,
} from '@/domain';

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
    currentRank: '雀魂 雀圣 3',
    normalizedRankScore: 672,
    status: 'Active',
  },
];

export const mockClubs: ClubSummary[] = [
  { id: 'club-1', name: 'Tokyo Drift', memberCount: 18, powerRating: 92, treasury: 560000, relations: ['Alliance'] },
  { id: 'club-2', name: 'Red Dora', memberCount: 14, powerRating: 88, treasury: 438000, relations: ['Hostile'] },
];

export const mockTournamentProfiles: TournamentPublicProfile[] = [
  {
    id: 'tournament-spring-2026',
    name: 'Riichi Nexus Spring Masters',
    status: 'InProgress',
    tagline: '春季旗舰赛事，聚焦俱乐部强度与长周期积分。',
    description:
      'Spring Masters 是 RiichiNexus 当前最核心的公开赛事。公开区展示赛段排期、报名状态和下一轮信息，详细桌况与运营台数据则留给后台角色。',
    venue: 'Shanghai Esports Hall',
    stageCount: 4,
    whitelistType: 'Mixed',
    nextStageId: 'stage-swiss-2',
    nextStageName: 'Swiss Round 2',
    nextStageStatus: 'Active',
    nextScheduledAt: '2026-03-25T10:00:00+08:00',
  },
  {
    id: 'tournament-kanto-open',
    name: 'Kanto Club Open',
    status: 'Registration',
    tagline: '偏公开邀请制的地区俱乐部对抗赛。',
    description:
      'Kanto Club Open 更适合展示报名窗口和赛段预告。后续如果后端补赛事详情接口，这里可以直接切到真实详情数据。',
    venue: 'Kanto Riichi Arena',
    stageCount: 3,
    whitelistType: 'Club',
    nextStageId: 'stage-qualifier-a',
    nextStageName: 'Qualifier A',
    nextStageStatus: 'Pending',
    nextScheduledAt: '2026-03-28T13:30:00+08:00',
  },
];

export const mockClubProfiles: ClubPublicProfile[] = [
  {
    id: 'club-1',
    name: 'Tokyo Drift',
    slogan: 'Fast tempo, cold reads, no wasted turns.',
    description:
      'Tokyo Drift 是公开区里最适合展示品牌感的俱乐部对象。详情页重点展示成员规模、战力、联盟关系和正在参与的赛事。',
    memberCount: 18,
    powerRating: 92,
    treasury: 560000,
    relations: ['Alliance'],
    featuredPlayers: ['Aoi', 'Kanna', 'Rin'],
    activeTournaments: [
      { id: 'mock-tournament-1', name: 'Riichi Nexus Spring Masters', source: 'recent' },
      { id: 'mock-tournament-2', name: 'Kanto Club Open', source: 'recent' },
    ],
  },
  {
    id: 'club-2',
    name: 'Red Dora',
    slogan: 'Explosive offense with a taste for variance.',
    description:
      'Red Dora 适合在详情页里强调战术风格、核心成员和俱乐部资源概况，这些都是游客会感兴趣的公开信息。',
    memberCount: 14,
    powerRating: 88,
    treasury: 438000,
    relations: ['Hostile'],
    featuredPlayers: ['Mika', 'Shun', 'Rui'],
    activeTournaments: [{ id: 'mock-tournament-1', name: 'Riichi Nexus Spring Masters', source: 'recent' }],
  },
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
    ownerId: 'player-b',
    ownerType: 'player',
    headline: '这里可以继续扩展到最近对局、积分轨迹和申诉入口。',
    metrics: [
      { label: '综合 ELO', value: '2087', accent: 'gold' },
      { label: '最近 30 战', value: '+63', accent: 'teal' },
      { label: '平均顺位', value: '2.18' },
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
  {
    ownerId: 'club-2',
    ownerType: 'club',
    headline: '后续可以在这里接入席位提报名单和联盟关系概览。',
    metrics: [
      { label: '俱乐部战力', value: '88', accent: 'gold' },
      { label: '资金库', value: '438,000', accent: 'teal' },
      { label: '活跃成员', value: '14' },
    ],
  },
];

export const mockTournamentTables: TournamentTableSummary[] = [
  { id: 'table-101', stageId: 'stage-swiss-1', tableCode: 'A-01', status: 'WaitingPreparation', playerIds: ['player-a', 'player-b', 'player-c', 'player-d'], seatCount: 4 },
  { id: 'table-102', stageId: 'stage-swiss-1', tableCode: 'A-02', status: 'InProgress', playerIds: ['player-e', 'player-f', 'player-g', 'player-h'], seatCount: 4 },
  { id: 'table-201', stageId: 'stage-finals', tableCode: 'F-01', status: 'AppealPending', playerIds: ['player-a', 'player-b', 'player-c', 'player-d'], seatCount: 4 },
];

export const mockRecords: MatchRecordSummary[] = [
  { id: 'record-101', tournamentId: 'tournament-123', stageId: 'stage-swiss-1', tableId: 'table-101', recordedAt: '2026-03-24T19:00:00+08:00', winnerId: 'player-a', summary: 'Aoi top 1 with +42.3 after Swiss table A-01' },
  { id: 'record-201', tournamentId: 'tournament-123', stageId: 'stage-finals', tableId: 'table-201', recordedAt: '2026-03-25T21:10:00+08:00', winnerId: 'player-b', summary: 'Mika secured finals lead before appeal review' },
];

export const mockAppeals: AppealSummary[] = [
  { id: 'appeal-123', tournamentId: 'tournament-123', tableId: 'table-201', status: 'Open', createdBy: 'player-c', createdAt: '2026-03-25T21:18:00+08:00', verdict: 'Waiting for tournament admin screenshot review' },
  { id: 'appeal-124', tournamentId: 'tournament-123', tableId: 'table-102', status: 'Resolved', createdBy: 'player-f', createdAt: '2026-03-24T20:32:00+08:00', verdict: 'Table result confirmed after log verification' },
];

export function toMockEnvelope<T>(
  items: T[],
  appliedFilters: Record<string, string | number | boolean | undefined>,
): ListEnvelope<T> {
  return {
    items,
    total: items.length,
    limit: items.length,
    offset: 0,
    hasMore: false,
    appliedFilters,
  };
}
