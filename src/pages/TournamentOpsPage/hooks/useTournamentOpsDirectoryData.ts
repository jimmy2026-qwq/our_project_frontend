import { useEffect, useState } from 'react';

import { TournamentListAPI } from '@/api/tournament/TournamentListAPI';
import { TournamentStageDirectoryAPI } from '@/api/tournament/TournamentStageDirectoryAPI';
import type {
  ListEnvelope,
  TournamentStageDirectoryEntry,
  TournamentSummaryView,
} from '@/objects';
import { sendAPI } from '@/system/api';

import type {
  TournamentContext,
  TournamentDirectoryState,
} from '../objects/data';
import {
  toTournamentDirectoryEntry,
  type TournamentDirectoryEntryView,
} from '../objects/TournamentOps.mappers';

export function useTournamentOpsDirectoryData(reloadKey = 0) {
  const [directory, setDirectory] = useState<TournamentDirectoryState | null>(
    null,
  );
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDirectory() {
      setIsLoadingDirectory(true);
      const nextDirectory = await loadTournamentDirectory();

      if (!cancelled) {
        setDirectory(nextDirectory);
        setIsLoadingDirectory(false);
      }
    }

    void loadDirectory();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return { directory, isLoadingDirectory };
}

async function loadTournamentDirectory(): Promise<TournamentDirectoryState> {
  try {
    const tournaments = await getTournaments();
    const items = await Promise.all(
      tournaments.items.map(async (tournament) => {
        const stages = await getTournamentStages(tournament.id);
        return {
          id: tournament.id,
          name: tournament.name,
          stages: stages.map((stage) => ({
            id: stage.stageId,
            name: stage.name,
          })),
        } satisfies TournamentContext;
      }),
    );

    return {
      items: items.filter((tournament) => tournament.stages.length > 0),
      source: 'api',
    };
  } catch (error) {
    return {
      items: [],
      source: 'api',
      warning:
        error instanceof Error
          ? error.message
          : 'Unable to load tournament directory.',
    };
  }
}

function getTournaments(filters = {}) {
  return sendAPI<ListEnvelope<TournamentSummaryView>>(
    new TournamentListAPI(filters),
  ).then(
    (envelope): ListEnvelope<TournamentDirectoryEntryView> => ({
      ...envelope,
      items: envelope.items.map(toTournamentDirectoryEntry),
    }),
  );
}

function getTournamentStages(tournamentId: string) {
  return sendAPI<TournamentStageDirectoryEntry[]>(
    new TournamentStageDirectoryAPI(tournamentId),
  );
}
