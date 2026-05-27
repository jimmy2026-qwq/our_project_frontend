import type {
  PublicTournamentDetailView,
  PublicTournamentStageView,
  TournamentPaifuSummaryView,
} from '@/objects';

import type { TablePaifuDetail } from '../types';

export function mapPaifuSummary(
  item: TournamentPaifuSummaryView | TablePaifuDetail,
): TablePaifuDetail {
  const legacy = item as Partial<TablePaifuDetail>;
  const summary = item as TablePaifuDetail & {
    paifuId?: string;
    tableId?: string;
    tournamentId?: string;
    stageId?: string;
    recordedAt?: string;
  };

  return {
    ...item,
    id: legacy.id ?? summary.paifuId ?? '',
    metadata: legacy.metadata ?? {
      tableId: summary.tableId ?? '',
      tournamentId: summary.tournamentId ?? '',
      stageId: summary.stageId ?? '',
      recordedAt: summary.recordedAt ?? '',
    },
    rounds: legacy.rounds ?? [],
    finalStandings: item.finalStandings ?? [],
  };
}

export function collectPaifuPlayerIds(paifu: TablePaifuDetail) {
  const playerIds = new Set<string>();
  const addPlayerId = (playerId?: string | null) => {
    if (playerId) {
      playerIds.add(playerId);
    }
  };

  paifu.metadata.seats?.forEach((seat) => addPlayerId(seat.playerId));
  paifu.finalStandings.forEach((standing) => addPlayerId(standing.playerId));
  paifu.rounds.forEach((round) => {
    Object.keys(round.initialHands).forEach(addPlayerId);
    round.actions.forEach((action) => addPlayerId(action.actor));
    addPlayerId(round.result.winner);
    addPlayerId(round.result.target);
    round.result.scoreChanges.forEach((change) => addPlayerId(change.playerId));
    round.result.tenpaiPlayerIds?.forEach(addPlayerId);
  });

  return [...playerIds];
}

export function getStageDisplayName(
  tournament: PublicTournamentDetailView,
  stage?: PublicTournamentStageView,
) {
  const formatLabel = getStageFormatLabel(stage?.format);

  if (formatLabel) {
    return `${tournament.name} ${formatLabel}`;
  }

  return stage?.name ?? undefined;
}

function getStageFormatLabel(format?: string) {
  switch (format) {
    case 'Knockout':
      return '淘汰赛';
    case 'Swiss':
      return '瑞士轮';
    default:
      return undefined;
  }
}
