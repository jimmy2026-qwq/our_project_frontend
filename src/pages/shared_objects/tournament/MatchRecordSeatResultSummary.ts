import type { TournamentMatchRecordSeatResultView } from '@/objects';

export type MatchRecordSeatResultSummary = Pick<
  TournamentMatchRecordSeatResultView,
  'playerId' | 'placement' | 'finalPoints' | 'scoreDelta'
>;
