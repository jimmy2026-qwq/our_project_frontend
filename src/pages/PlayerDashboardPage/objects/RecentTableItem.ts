import type { TournamentTableSummary } from '@/pages/shared_objects/tournament/TournamentTableSummary';

export interface RecentTableItem extends TournamentTableSummary {
  tournamentName: string;
}
