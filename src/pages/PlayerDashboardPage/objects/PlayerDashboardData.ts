import type { AppealSummary } from '@/pages/shared_objects/tournament/AppealSummary';
import type { DashboardSummary } from '@/pages/shared_objects/dashboard/OpsAnalyticsDashboard';
import type { MatchRecordSummary } from '@/pages/shared_objects/tournament/MatchRecordSummary';
import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';

import type { PlayerClubLink } from './PlayerClubLink';
import type { RecentTableItem } from './RecentTableItem';

export interface PlayerDashboardData {
  player: PlayerProfile;
  playerClubs: PlayerClubLink[];
  dashboard: DashboardSummary;
  recentTables: RecentTableItem[];
  archivedRecords: MatchRecordSummary[];
  appeals: AppealSummary[];
}
