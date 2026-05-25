export type SeatWind = 'East' | 'South' | 'West' | 'North';
export type TournamentFormat =
  | 'Swiss'
  | 'Knockout'
  | 'RoundRobin'
  | 'Finals'
  | 'Custom';
export type RankPlatform = 'Tenhou' | 'MahjongSoul' | 'Custom';
export type PlayerStatus = 'Active' | 'Suspended' | 'Banned';
export type TournamentParticipantKind = 'Club' | 'Player';
export type AdvancementRuleType =
  | 'SwissCut'
  | 'KnockoutElimination'
  | 'ScoreThreshold'
  | 'Custom';
export type SwissPairingMethod = 'balanced-elo' | 'snake';
export type KnockoutSeedingPolicy = 'rating' | 'elo' | 'ranking' | 'standings';

export type TournamentStatus =
  | 'Draft'
  | 'RegistrationOpen'
  | 'Scheduled'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'Archived';

export type StageStatus = 'Pending' | 'Ready' | 'Active' | 'Completed' | 'Archived';

export interface RankSnapshotView {
  platform: RankPlatform;
  tier: string;
  stars: number | null;
}

export interface AdvancementRuleView {
  ruleType: AdvancementRuleType;
  cutSize: number | null;
  thresholdScore: number | null;
  targetTableCount: number | null;
  templateKey: string | null;
  note: string | null;
}

export interface SwissRuleConfigView {
  pairingMethod: SwissPairingMethod;
  carryOverPoints: boolean;
  maxRounds: number | null;
}

export interface KnockoutRuleConfigView {
  bracketSize: number | null;
  thirdPlaceMatch: boolean;
  seedingPolicy: KnockoutSeedingPolicy;
  repechageEnabled: boolean;
}

export type TableStatus =
  | 'WaitingPreparation'
  | 'InProgress'
  | 'Scoring'
  | 'Archived'
  | 'AppealInProgress';

export type KnockoutLane = 'Championship' | 'Bronze' | 'Repechage';

export interface TableSeat {
  seat: SeatWind;
  playerId: string;
  initialPoints: number;
  disconnected: boolean;
  ready: boolean;
  clubId: string | null;
}

export interface Table {
  id: string;
  tableNo: number;
  tournamentId: string;
  stageId: string;
  seats: TableSeat[];
  stageRoundNumber: number;
  bracketMatchId: string | null;
  bracketRoundNumber: number | null;
  feederMatchIds: string[];
  status: TableStatus;
  startedAt: string | null;
  scoringStartedAt: string | null;
  endedAt: string | null;
  paifuId: string | null;
  matchRecordId: string | null;
  appealTicketIds: string[];
  resetCount: number;
  operatorNotes: string[];
  version: number;
}

export interface StageStandingEntry {
  playerId: string;
  matchesPlayed: number;
  placementPoints: number;
  totalScoreDelta: number;
  totalFinalPoints: number;
  averagePlacement: number;
  qualified: boolean;
  seed: number | null;
}

export interface StageRankingSnapshot {
  tournamentId: string;
  stageId: string;
  generatedAt: string;
  entries: StageStandingEntry[];
  archivedTableCount: number;
  scheduledTableCount: number;
}

export interface StageAdvancementSnapshot {
  tournamentId: string;
  stageId: string;
  generatedAt: string;
  rule: string;
  standings: StageStandingEntry[];
  qualifiedPlayerIds: string[];
  reservePlayerIds: string[];
  summary: string;
}

export interface KnockoutBracketSlot {
  seed: number;
  playerId: string | null;
  bye: boolean;
  sourceMatchId: string | null;
  sourcePlacement: number | null;
}

export interface KnockoutBracketResult {
  playerId: string;
  placement: number;
  finalPoints: number;
  advanced: boolean;
}

export interface KnockoutBracketMatch {
  id: string;
  roundNumber: number;
  position: number;
  lane: KnockoutLane;
  slots: KnockoutBracketSlot[];
  sourceMatchIds: string[];
  advancementCount: number;
  nextMatchId: string | null;
  tableId: string | null;
  unlocked: boolean;
  completed: boolean;
  results: KnockoutBracketResult[];
}

export interface KnockoutBracketRound {
  roundNumber: number;
  label: string;
  matches: KnockoutBracketMatch[];
}

export interface KnockoutBracketSnapshot {
  tournamentId: string;
  stageId: string;
  generatedAt: string;
  bracketSize: number;
  qualifiedPlayerIds: string[];
  rounds: KnockoutBracketRound[];
  summary: string;
}
