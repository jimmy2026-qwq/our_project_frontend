import { useEffect, useState } from 'react';

import { GetPlayerAPI } from '@/api/player';
import { GetPublicTournamentAPI } from '@/api/tournament';
import { TournamentPaifuGetAPI } from '@/api/tournament/TournamentPaifuGetAPI';
import { TournamentPaifuListAPI } from '@/api/tournament/TournamentPaifuListAPI';
import type {
  ListEnvelope,
  Paifu,
  PaifuSummary,
  PublicTournamentDetailView,
} from '@/objects';
import type { PlayerProfileView } from '@/objects/player';
import { sendAPI } from '@/system/api';
import { ApiError } from '@/system/api/http';

import { createDemoTablePaifu } from '../demo';
import { getInitialRoundIndex } from '../functions/getReplay';
import {
  collectPaifuPlayerIds,
  getStageDisplayName,
} from '../functions/getTablePaifuMetadata';
import { toPaifuSummary } from '../objects/TablePaifuData.mappers';
import type { TablePaifuDetail } from '../types';

export function useTablePaifuData(tableId: string) {
  const [paifu, setPaifu] = useState<TablePaifuDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadPaifu() {
      try {
        setIsLoading(true);
        setError(null);
        const payload = await loadTablePaifus(tableId);

        if (!cancelled) {
          applyLoadedPaifu(payload.items[0], tableId, {
            setError,
            setPaifu,
            setSelectedRoundIndex,
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          applyDemoPaifu(tableId, {
            message: getFallbackErrorMessage(loadError),
            setError,
            setPaifu,
            setSelectedRoundIndex,
          });
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (tableId) {
      void loadPaifu();
    } else {
      setError('Missing table id.');
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [tableId]);

  return {
    paifu,
    error,
    isLoading,
    selectedRoundIndex,
    setSelectedRoundIndex,
  };
}

export async function loadTablePaifus(
  tableId: string,
): Promise<ListEnvelope<TablePaifuDetail>> {
  const envelope = await sendAPI<ListEnvelope<PaifuSummary>>(
    new TournamentPaifuListAPI({ tableId }),
  );
  const paifus = await Promise.all(
    envelope.items.map((summary) =>
      sendAPI<Paifu>(new TournamentPaifuGetAPI(summary.paifuId)),
    ),
  );

  return {
    ...envelope,
    items: await Promise.all(paifus.map(toPaifuSummary).map(enrichPaifu)),
  };
}

function applyLoadedPaifu(
  paifu: TablePaifuDetail | undefined,
  tableId: string,
  setters: TablePaifuSetters,
) {
  if (paifu) {
    setters.setPaifu(paifu);
    setters.setSelectedRoundIndex(getInitialRoundIndex(paifu.rounds));
    return;
  }

  applyDemoPaifu(tableId, {
    ...setters,
    message: 'No paifu record is available yet. Showing temporary demo data.',
  });
}

function applyDemoPaifu(
  tableId: string,
  params: TablePaifuSetters & { message: string },
) {
  const demoPaifu = createDemoTablePaifu(tableId);
  params.setPaifu(demoPaifu);
  params.setSelectedRoundIndex(getInitialRoundIndex(demoPaifu.rounds));
  params.setError(params.message);
}

interface TablePaifuSetters {
  setError: (message: string | null) => void;
  setPaifu: (paifu: TablePaifuDetail) => void;
  setSelectedRoundIndex: (index: number) => void;
}

function getFallbackErrorMessage(error: unknown) {
  if (error instanceof ApiError || error instanceof Error) {
    return `${error.message} Showing temporary demo data.`;
  }

  return 'Failed to load paifu details. Showing temporary demo data.';
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

  return { ...paifu, metadata };
}

async function getPlayerName(playerId: string) {
  const player = await sendAPI<PlayerProfileView>(new GetPlayerAPI(playerId));

  return player.nickname;
}
