import type {
  PublicTournamentDetailView,
  PublicTournamentStageView,
} from '@/objects';

import type { TablePaifuDetail } from '../types';

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
