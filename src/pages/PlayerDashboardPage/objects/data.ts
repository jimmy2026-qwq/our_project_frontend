import type { TournamentTableSummary } from '@/pages/objects/tournament';

import {
  getAppeals,
  getCurrentPlayer,
  getPlayerDashboard,
  getRecords,
  getTables,
} from './dashboard.api';
import {
  getPlayerClubLinks,
  withRecordDisplayNames,
  withTournamentNames,
} from './dashboard.mappers';

function getActiveTableRank(status: TournamentTableSummary['status']) {
  switch (status) {
    case 'InProgress':
      return 0;
    case 'Scoring':
      return 1;
    case 'AppealInProgress':
      return 2;
    default:
      return 3;
  }
}

export async function loadPlayerDashboardData(operatorId: string) {
  const [player, dashboard, tablesEnvelope, recordsEnvelope, appealsEnvelope] =
    await Promise.all([
      getCurrentPlayer(operatorId),
      getPlayerDashboard(operatorId, operatorId),
      getTables({ playerId: operatorId, limit: 8 }),
      getRecords({ playerId: operatorId, limit: 8 }),
      getAppeals({
        openedBy: operatorId,
        limit: 20,
        offset: 0,
      }),
    ]);
  const playerClubs = await getPlayerClubLinks(player.clubIds ?? []);
  const rawRecentTables = tablesEnvelope.items
    .filter((table) => table.status !== 'Archived')
    .sort(
      (left, right) =>
        getActiveTableRank(left.status) - getActiveTableRank(right.status),
    );
  const archivedRecords = [...recordsEnvelope.items]
    .sort((left, right) => right.recordedAt.localeCompare(left.recordedAt))
    .slice(0, 8);
  const appeals = [...appealsEnvelope.items].sort((left, right) =>
    (right.updatedAt ?? right.createdAt).localeCompare(
      left.updatedAt ?? left.createdAt,
    ),
  );

  return {
    player,
    playerClubs,
    dashboard,
    recentTables: await withTournamentNames(rawRecentTables),
    archivedRecords: await withRecordDisplayNames(archivedRecords),
    appeals,
  };
}

export type PlayerDashboardData = Awaited<
  ReturnType<typeof loadPlayerDashboardData>
>;
export type { PlayerClubLink, RecentTableItem } from './dashboard.types';
