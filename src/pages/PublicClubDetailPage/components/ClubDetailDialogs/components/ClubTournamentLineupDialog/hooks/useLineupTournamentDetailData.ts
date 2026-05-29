import { useEffect, useState } from 'react';

import {
  GetPublicTournamentAPI,
  TournamentGetAPI,
  TournamentStageDirectoryAPI,
} from '@/api/tournament';
import type {
  TournamentDetailView,
  TournamentOperationsStageView,
} from '@/objects/tournament';
import { sendAPI } from '@/system/api';

import { toPublicTournamentDetail } from '../../../../../objects/ClubDetailTournament.mappers';
import {
  createFallbackTournamentDetailForLineup,
  getSelectedPlayerIds,
  mergeTournamentStages,
  toDetailStageFromPublicStage,
  toDetailStageFromStageDirectoryEntry,
} from '../functions/getLineupTournamentDetail';
import type { ClubTournamentItem } from '../objects/ClubTournamentItem';

interface UseLineupTournamentDetailDataParams {
  clubId: string;
  tournament: ClubTournamentItem | null;
  open: boolean;
  notifyWarning: (title: string, description?: string) => void;
}

export function useLineupTournamentDetailData({
  clubId,
  tournament,
  open,
  notifyWarning,
}: UseLineupTournamentDetailDataParams) {
  const [selectedStageId, setSelectedStageId] = useState('');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [tournamentDetail, setTournamentDetail] =
    useState<TournamentDetailView | null>(null);
  const [initializedStageId, setInitializedStageId] = useState('');
  const [isLoadingTournamentDetail, setIsLoadingTournamentDetail] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedStageId('');
    setInitializedStageId('');
    setSelectedPlayerIds([]);
  }, [open]);

  useEffect(() => {
    if (!open || !tournament?.id) {
      setTournamentDetail(null);
      setSelectedStageId('');
      setSelectedPlayerIds([]);
      return;
    }

    let cancelled = false;
    setIsLoadingTournamentDetail(true);

    void loadTournamentDetailForLineup(tournament)
      .then((detail) => {
        if (cancelled) {
          return;
        }

        setTournamentDetail(detail);
        const defaultStageId = detail.stages?.[0]?.stageId ?? '';
        setSelectedStageId((current) => current || defaultStageId);
      })
      .catch((error) => {
        if (!cancelled) {
          notifyWarning(
            'Unable to load tournament detail.',
            error instanceof Error ? error.message : 'Please try again.',
          );
          setTournamentDetail(null);
          setSelectedStageId('');
          setSelectedPlayerIds([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingTournamentDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [notifyWarning, open, tournament]);

  useEffect(() => {
    if (!selectedStageId) {
      setSelectedPlayerIds([]);
      setInitializedStageId('');
      return;
    }

    if (initializedStageId === selectedStageId) {
      return;
    }

    setSelectedPlayerIds(
      getSelectedPlayerIds(tournamentDetail, clubId, selectedStageId),
    );
    setInitializedStageId(selectedStageId);
  }, [clubId, initializedStageId, selectedStageId, tournamentDetail]);

  return {
    tournamentDetail,
    selectedStageId,
    setSelectedStageId,
    selectedPlayerIds,
    setSelectedPlayerIds,
    isLoadingTournamentDetail,
  };
}

async function loadTournamentDetailForLineup(
  tournament: ClubTournamentItem,
): Promise<TournamentDetailView> {
  const [detailResult, stageDirectory, publicStages] = await Promise.all([
    sendAPI(new TournamentGetAPI(tournament.id)).catch(() => null),
    loadTournamentStageDirectory(tournament.id),
    loadPublicStagesForLineup(tournament.id),
  ]);
  const fallbackStages =
    stageDirectory.length > 0
      ? stageDirectory.map(toDetailStageFromStageDirectoryEntry)
      : publicStages;

  if (detailResult) {
    return {
      ...detailResult,
      stages: mergeTournamentStages(fallbackStages, detailResult.stages ?? []),
    };
  }

  if (fallbackStages.length > 0) {
    return createFallbackTournamentDetailForLineup(tournament, fallbackStages);
  }

  throw new Error('No lineup stage is available for this tournament yet.');
}

async function loadTournamentStageDirectory(tournamentId: string) {
  try {
    return await sendAPI(new TournamentStageDirectoryAPI(tournamentId));
  } catch {
    return [];
  }
}

async function loadPublicStagesForLineup(
  tournamentId: string,
): Promise<TournamentOperationsStageView[]> {
  try {
    const publicDetail = await sendAPI(
      new GetPublicTournamentAPI(tournamentId),
    ).then(toPublicTournamentDetail);

    return (publicDetail.stages ?? []).map(toDetailStageFromPublicStage);
  } catch {
    return [];
  }
}
