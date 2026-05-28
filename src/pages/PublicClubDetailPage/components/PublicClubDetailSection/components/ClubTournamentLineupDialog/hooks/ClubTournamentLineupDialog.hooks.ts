import { useEffect, useMemo, useState } from 'react';

import { TournamentStageSubmitLineupAPI } from '@/api/tournament';
import type { TournamentDetailView } from '@/objects/tournament';
import type { PlayerProfile } from '@/pages/objects/player';
import { useNotice } from '@/app/feedback/useNotice';
import { sendAPI } from '@/system/api';

import type {
  ClubTournamentItem,
  ClubTournamentLineupWorkbench,
  EloSort,
  MemberStatusFilter,
} from '../types';
import {
  getVisibleLineupMembers,
  loadClubLineupMembers,
} from '../objects/lineup-members';
import {
  getSelectedPlayerIds,
  loadTournamentDetailForLineup,
} from '../objects/lineup-tournament-detail';

interface UseClubTournamentLineupWorkbenchParams {
  clubId: string;
  operatorId: string;
  tournament: ClubTournamentItem | null;
  open: boolean;
}

export function useClubTournamentLineupWorkbench({
  clubId,
  operatorId,
  tournament,
  open,
}: UseClubTournamentLineupWorkbenchParams) {
  const { notifySuccess, notifyWarning } = useNotice();
  const [members, setMembers] = useState<PlayerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>('all');
  const [eloSort, setEloSort] = useState<EloSort>('desc');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [tournamentDetail, setTournamentDetail] =
    useState<TournamentDetailView | null>(null);
  const [initializedStageId, setInitializedStageId] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedStageId('');
    setInitializedStageId('');
    setSelectedPlayerIds([]);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void loadClubLineupMembers(clubId)
      .then((items) => {
        if (!cancelled) {
          setMembers(items);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          notifyWarning(
            'Unable to load club members.',
            error instanceof Error
              ? error.message
              : 'Please try again.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clubId, notifyWarning, open]);

  useEffect(() => {
    if (!open || !tournament?.id) {
      setTournamentDetail(null);
      setSelectedStageId('');
      setSelectedPlayerIds([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

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
            error instanceof Error
              ? error.message
              : 'Please try again.',
          );
          setTournamentDetail(null);
          setSelectedStageId('');
          setSelectedPlayerIds([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
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

  const stageOptions = tournamentDetail?.stages ?? [];

  const visibleMembers = useMemo(
    () =>
      getVisibleLineupMembers({
        members,
        operatorId,
        selectedPlayerIds,
        statusFilter,
        eloSort,
      }),
    [eloSort, members, operatorId, selectedPlayerIds, statusFilter],
  );

  const workbench: ClubTournamentLineupWorkbench = {
    members,
    isLoading,
    isSubmitting,
    selectedStageId,
    statusFilter,
    eloSort,
    selectedPlayerIds,
    tournamentDetail,
    stageOptions,
    visibleMembers,
  };

  function togglePlayer(playerId: string) {
    setSelectedPlayerIds((current) =>
      current.includes(playerId)
        ? current.filter((item) => item !== playerId)
        : [...current, playerId],
    );
  }

  async function submitLineup() {
    const effectiveStageId =
      selectedStageId || stageOptions[0]?.stageId || '';

    if (!tournament?.id || !effectiveStageId || selectedPlayerIds.length === 0) {
      notifyWarning(
        'Lineup is incomplete',
        'Select a stage and at least one player before submitting the lineup.',
      );
      return false;
    }

    try {
      setIsSubmitting(true);
      await sendAPI(
        new TournamentStageSubmitLineupAPI(tournament.id, effectiveStageId, {
          clubId,
          operatorId,
          seats: selectedPlayerIds.map((playerId) => ({ playerId })),
        }),
      );
      notifySuccess(
        'Lineup submitted',
        'The tournament lineup has been submitted.',
      );
      return true;
    } catch (error) {
      notifyWarning(
        'Unable to submit lineup',
        error instanceof Error
          ? error.message
          : 'The lineup submission did not complete.',
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    workbench,
    setSelectedStageId,
    setStatusFilter,
    setEloSort,
    setSelectedPlayerIds,
    togglePlayer,
    submitLineup,
  };
}
