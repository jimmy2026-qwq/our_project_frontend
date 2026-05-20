import type {
  TournamentDetailView,
  TournamentLineupSubmissionView,
  TournamentMutationView,
  TournamentOperationsStageView,
  TournamentParticipantClubView,
  TournamentParticipantPlayerView,
  TournamentStageDirectoryEntry,
  TournamentStageSummaryView,
  TournamentSummaryView,
  TournamentWhitelistEntryView,
  TournamentWhitelistSummaryView,
} from './TournamentResponses';
import type { TournamentTableView } from './TableResponses';
import type { TournamentMatchRecordView } from './MatchRecordResponses';
import type { TournamentPaifuSummaryView } from './PaifuResponses';
import type { TournamentSettlementView } from './SettlementResponses';

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
