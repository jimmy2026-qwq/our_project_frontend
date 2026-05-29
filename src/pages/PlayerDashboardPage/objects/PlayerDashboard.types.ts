import type {
  AppealSummary,
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/pages/objects/TournamentViews';
import type { DashboardSummary } from '@/pages/objects/OpsAnalyticsDashboard';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

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
