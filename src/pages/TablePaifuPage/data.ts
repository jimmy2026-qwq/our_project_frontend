import { GetPlayerAPI } from '@/api/player';
import { GetPublicTournamentAPI } from '@/api/publicquery';
import { TournamentPaifuListAPI } from '@/api/tournament/TournamentPaifuListAPI';
import type {
  ListEnvelope,
  PublicTournamentDetailView,
  PublicTournamentStageView,
  TournamentPaifuSummaryView,
} from '@/objects';
import type { PlayerProfileView } from '@/objects/player';
import { sendAPI } from '@/system/api';

import type { TablePaifuDetail } from './types';

function mapPaifuSummary(
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

function getStageDisplayName(
  tournament: PublicTournamentDetailView,
  stage?: PublicTournamentStageView,
) {
  const formatLabel = getStageFormatLabel(stage?.format);

  if (formatLabel) {
    return `${tournament.name} ${formatLabel}`;
  }

  return stage?.name ?? undefined;
}

function collectPaifuPlayerIds(paifu: TablePaifuDetail) {
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

async function getPlayerName(playerId: string) {
  const player = await sendAPI<PlayerProfileView>(new GetPlayerAPI(playerId));

  return player.nickname;
}

async function enrichPaifu(paifu: TablePaifuDetail): Promise<TablePaifuDetail> {
  const metadata = { ...paifu.metadata };
  const [tournamentResult, playerNameEntries] = await Promise.all([
    metadata.tournamentId
      ? sendAPI<PublicTournamentDetailView>(
          new GetPublicTournamentAPI(metadata.tournamentId),
        ).catch(() => undefined)
      : Promise.resolve(undefined),
    Promise.all(
      collectPaifuPlayerIds(paifu).map(async (playerId) => {
        try {
          return [playerId, await getPlayerName(playerId)] as const;
        } catch {
          return [playerId, playerId] as const;
        }
      }),
    ),
  ]);

  if (tournamentResult) {
    const stage = tournamentResult.stages.find(
      (candidate) => candidate.stageId === metadata.stageId,
    );

    metadata.tournamentName = tournamentResult.name;
    metadata.stageName = getStageDisplayName(tournamentResult, stage);
  }

  metadata.playerNames = {
    ...Object.fromEntries(playerNameEntries),
    ...metadata.playerNames,
  };

  return {
    ...paifu,
    metadata,
  };
}

export async function loadTablePaifus(
  tableId: string,
): Promise<ListEnvelope<TablePaifuDetail>> {
  const envelope = await sendAPI<ListEnvelope<TournamentPaifuSummaryView>>(
    new TournamentPaifuListAPI({ tableId }),
  );

  return {
    ...envelope,
    items: await Promise.all(envelope.items.map(mapPaifuSummary).map(enrichPaifu)),
  };
}
