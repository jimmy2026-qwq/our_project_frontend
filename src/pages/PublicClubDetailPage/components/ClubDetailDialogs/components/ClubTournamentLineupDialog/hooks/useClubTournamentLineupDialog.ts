import { useMemo, useState } from 'react';

import { useNotice } from '@/app/feedback/useNotice';

import type { ClubTournamentItem } from '../objects/ClubTournamentItem';
import type { ClubTournamentLineupWorkbench } from '../objects/ClubTournamentLineupWorkbench';
import type { EloSort } from '../objects/EloSort';
import type { MemberStatusFilter } from '../objects/MemberStatusFilter';
import { getVisibleLineupMembers } from '../functions/getLineupMembers';
import { useLineupMembersData } from './useLineupMembersData';
import { useLineupSubmission } from './useLineupSubmission';
import { useLineupTournamentDetailData } from './useLineupTournamentDetailData';

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
  const [statusFilter, setStatusFilter] = useState<MemberStatusFilter>('all');
  const [eloSort, setEloSort] = useState<EloSort>('desc');
  const { members, isLoadingMembers } = useLineupMembersData({
    clubId,
    open,
    notifyWarning,
  });
  const {
    tournamentDetail,
    selectedStageId,
    setSelectedStageId,
    selectedPlayerIds,
    setSelectedPlayerIds,
    isLoadingTournamentDetail,
  } = useLineupTournamentDetailData({
    clubId,
    tournament,
    open,
    notifyWarning,
  });

  const stageOptions = tournamentDetail?.stages ?? [];
  const { isSubmitting, submitLineup } = useLineupSubmission({
    clubId,
    operatorId,
    tournament,
    selectedStageId,
    selectedPlayerIds,
    stageOptions,
    notifySuccess,
    notifyWarning,
  });

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
    isLoading: isLoadingMembers || isLoadingTournamentDetail,
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
