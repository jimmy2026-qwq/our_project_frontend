import type { AppealSummary } from '@/pages/shared_objects/tournament/AppealSummary';
import type { MatchRecordSummary } from '@/pages/shared_objects/tournament/MatchRecordSummary';
import type { TournamentTableSummary } from '@/pages/shared_objects/tournament/TournamentTableSummary';
import type { DashboardSummary } from '@/pages/shared_objects/dashboard/OpsAnalyticsDashboard';
import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';

export interface RecentTableItem extends TournamentTableSummary {
  tournamentName: string;
}

export interface PlayerClubLink {
  id: string;
  name: string;
}

export type NamedMatchRecordSummary = MatchRecordSummary;

export interface PlayerDashboardData {
  player: PlayerProfile;
  playerClubs: PlayerClubLink[];
  dashboard: DashboardSummary;
  recentTables: RecentTableItem[];
  archivedRecords: MatchRecordSummary[];
  appeals: AppealSummary[];
}
