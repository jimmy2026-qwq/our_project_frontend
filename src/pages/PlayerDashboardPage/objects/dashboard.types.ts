import type {
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/pages/objects/tournament';

export interface RecentTableItem extends TournamentTableSummary {
  tournamentName: string;
}

export interface PlayerClubLink {
  id: string;
  name: string;
}

export type NamedMatchRecordSummary = MatchRecordSummary;
