export type SeatWind = 'East' | 'South' | 'West' | 'North';
export type TournamentFormat = 'Swiss' | 'Knockout';
export type AdvancementRuleType =
  | 'SwissCut'
  | 'KnockoutElimination'
  | 'ScoreThreshold'
  | 'Custom';

export type TournamentStatus =
  | 'Draft'
  | 'Registration'
  | 'RegistrationOpen'
  | 'Scheduled'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'Archived'
  | 'Finished';

export type StageStatus = 'Pending' | 'Ready' | 'Active' | 'Completed' | 'Archived';

export interface AdvancementRuleView {
  ruleType: AdvancementRuleType;
  cutSize?: number | null;
  thresholdScore?: number | null;
  targetTableCount?: number | null;
  templateKey?: string | null;
  note?: string | null;
}

export interface SwissRuleConfigView {
  pairingMethod: string;
  carryOverPoints: boolean;
  maxRounds?: number | null;
}

export interface KnockoutRuleConfigView {
  bracketSize?: number | null;
  thirdPlaceMatch: boolean;
  seedingPolicy: string;
  repechageEnabled: boolean;
}

export type TableStatus =
  | 'WaitingPreparation'
  | 'InProgress'
  | 'Scoring'
  | 'Archived'
  | 'AppealPending'
  | 'AppealInProgress';

export interface TableSeat {
  seat: SeatWind;
  playerId: string;
  initialPoints: number;
  disconnected: boolean;
  ready: boolean;
  clubId?: string | null;
}

export interface Table {
  id: string;
  tableNo: number;
  tournamentId: string;
  stageId: string;
  seats: TableSeat[];
  stageRoundNumber: number;
  bracketMatchId?: string | null;
  bracketRoundNumber?: number | null;
  feederMatchIds: string[];
  status: string;
  startedAt?: string | null;
  scoringStartedAt?: string | null;
  endedAt?: string | null;
  paifuId?: string | null;
  matchRecordId?: string | null;
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
  seed?: number | null;
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
  playerId?: string | null;
  bye: boolean;
  sourceMatchId?: string | null;
  sourcePlacement?: number | null;
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
  lane: string;
  slots: KnockoutBracketSlot[];
  sourceMatchIds: string[];
  advancementCount: number;
  nextMatchId?: string | null;
  tableId?: string | null;
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
