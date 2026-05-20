import type { TableStatus } from '@/system/objects/apiTypes/common';
import type { SeatWind } from './TournamentDomainTypes';

export interface TournamentTableSeatView {
  seat: SeatWind;
  playerId: string;
  initialPoints?: number;
  disconnected?: boolean;
  ready?: boolean;
  clubId?: string | null;
}

export interface TournamentTableView {
  tableId?: string;
  id: string;
  tournamentId?: string;
  stageId: string;
  tableNo: number;
  status?: TableStatus;
  seats?: TournamentTableSeatView[];
}

export interface TournamentStageSummaryView {
  stageId: string;
  name: string;
  format: string;
  order: number;
  status: string;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  pendingTablePlanCount: number;
  scheduledTableCount: number;
}

export interface TournamentSummaryView {
  tournamentId: string;
  name: string;
  organizer: string;
  startsAt: string;
  endsAt: string;
  status: string;
  participatingClubIds: string[];
  participatingPlayerIds: string[];
  adminIds: string[];
  whitelistCount: number;
  stages: TournamentStageSummaryView[];
}

export interface TournamentLineupSubmissionView {
  submissionId: string;
  clubId: string;
  submittedBy: string;
  submittedAt: string;
  activePlayerIds: string[];
  reservePlayerIds: string[];
  note?: string | null;
}

export interface TournamentParticipantClubView {
  clubId: string;
  memberCount: number;
}

export interface TournamentParticipantPlayerView {
  playerId: string;
  nickname: string;
  status: string;
  elo: number;
  currentRank: {
    platform: string;
    tier: string;
    stars?: number | null;
  };
  clubIds: string[];
}

export interface TournamentWhitelistSummaryView {
  totalEntries: number;
  clubCount: number;
  playerCount: number;
  clubIds: string[];
  playerIds: string[];
}

export interface TournamentStageDirectoryEntry {
  stageId: string;
  name: string;
  format: string;
  order: number;
  status: string;
  currentRound: number;
  roundCount: number;
  schedulingPoolSize: number;
  pendingTablePlanCount: number;
  scheduledTableCount: number;
}

export interface TournamentOperationsStageView {
  stageId: string;
  name: string;
  status: string;
  format?: string;
  order?: number;
  currentRound?: number;
  roundCount?: number;
  schedulingPoolSize?: number;
  pendingTablePlanCount?: number;
  scheduledTableCount?: number;
  lineupSubmissions?: TournamentLineupSubmissionView[];
}

export interface TournamentDetailView {
  tournamentId: string;
  name: string;
  organizer: string;
  status: string;
  startsAt: string;
  endsAt: string;
  participatingClubs?: TournamentParticipantClubView[];
  participatingPlayers?: Array<{ playerId: string }>;
  whitelistSummary?: TournamentWhitelistSummaryView;
  stages?: TournamentOperationsStageView[];
}

export interface TournamentMutationView {
  tournament: TournamentDetailView;
  scheduledTables: TournamentTableView[];
}

export interface TournamentMatchRecordSeatResultView {
  playerId: string;
  seat: SeatWind;
  clubId?: string | null;
  finalPoints: number;
  placement: number;
  scoreDelta: number;
  uma: number;
  oka: number;
}

export interface TournamentMatchRecordView {
  recordId: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  stageRoundNumber: number;
  generatedAt: string;
  seatResults: TournamentMatchRecordSeatResultView[];
  paifuId?: string | null;
  finalizedBy?: string | null;
  sourceEvent: string;
  notes: string[];
}

export interface TournamentPaifuFinalStandingView {
  playerId: string;
  seat: SeatWind;
  finalPoints: number;
  placement: number;
  uma: number;
  oka: number;
}

export interface TournamentPaifuSummaryView {
  paifuId: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  recordedAt: string;
  source: string;
  matchRecordId?: string | null;
  totalHands: number;
  playerIds: string[];
  finalStandings: TournamentPaifuFinalStandingView[];
}

export interface TournamentSettlementAdjustmentView {
  playerId: string;
  label: string;
  amount: number;
  note?: string | null;
}

export interface TournamentSettlementEntryView {
  playerId: string;
  rank: number;
  awardAmount: number;
  baseAwardAmount: number;
  adjustmentAmount: number;
  deductionAmount: number;
  clubId?: string | null;
  clubShareAmount: number;
  playerRetainedAmount: number;
  finalPoints: number;
  champion: boolean;
}

export interface TournamentSettlementView {
  settlementId: string;
  tournamentId: string;
  stageId: string;
  revision: number;
  status: string;
  generatedAt: string;
  finalizedAt?: string | null;
  supersededAt?: string | null;
  supersedesSettlementId?: string | null;
  championId: string;
  prizePool: number;
  houseFeeAmount: number;
  netPrizePool: number;
  clubShareRatio: number;
  adjustments: TournamentSettlementAdjustmentView[];
  entries: TournamentSettlementEntryView[];
  summary: string;
}

export interface TournamentWhitelistEntryView {
  participantKind: string;
  playerId?: string | null;
  clubId?: string | null;
}

export type TournamentStageDirectoryResponse = TournamentStageDirectoryEntry;
export type TournamentStageSummaryResponse = TournamentStageSummaryView;
export type TournamentSummaryResponse = TournamentSummaryView;
export type TournamentWhitelistEntryResponse = TournamentWhitelistEntryView;
export type TournamentTableResponse = TournamentTableView;
export type TournamentMatchRecordResponse = TournamentMatchRecordView;
export type TournamentPaifuSummaryResponse = TournamentPaifuSummaryView;
export type TournamentSettlementResponse = TournamentSettlementView;
export type TournamentParticipantClubResponse = TournamentParticipantClubView;
export type TournamentParticipantPlayerResponse = TournamentParticipantPlayerView;
export type TournamentWhitelistSummaryResponse = TournamentWhitelistSummaryView;
export type TournamentLineupSubmissionResponse = TournamentLineupSubmissionView;
export type TournamentOperationsStageResponse = TournamentOperationsStageView;
export type TournamentDetailResponse = TournamentDetailView;
export type TournamentMutationResponse = TournamentMutationView;
