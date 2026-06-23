import { useMemo } from 'react';

import { useConfirmationDialogActions } from '@/components/confirmation-dialog/useConfirmationDialogActions';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import type { AuthContextSession } from '@/app/auth/AuthContextSession';
import type { ClubDetailState } from '@/pages/PublicClubDetailPage/objects/state/ClubDetailState';

import { useClubDetailActions } from './useClubDetailActions';
import { useClubDetailData } from './useClubDetailData';
import { buildClubDetailWorkbench } from '../functions/buildClubDetailWorkbench';

interface UseClubDetailWorkbenchParams {
  state: ClubDetailState | null;
  session: AuthContextSession | null;
  onRefreshDetail?: () => void;
}

export function useClubDetailWorkbench({
  state,
  session,
  onRefreshDetail,
}: UseClubDetailWorkbenchParams) {
  const { confirmDanger } = useConfirmationDialogActions();
  const { notifyMutationResult } = useMutationNotice();
  const profile = state?.item ?? null;
  const data = useClubDetailData({ profile, session });

  const workbench = useMemo(
    () => buildClubDetailWorkbench({ profile, session, data }),
    [data, profile, session],
  );

  const actions = useClubDetailActions({
    confirmDanger,
    data,
    notifyMutationResult,
    onRefreshDetail,
    profile,
    workbench,
  });

  return {
    workbench,
    setIsApplicationDialogOpen: data.setIsApplicationDialogOpen,
    setIsLineupDialogOpen: data.setIsLineupDialogOpen,
    setSelectedLineupTournament: data.setSelectedLineupTournament,
    setIsContributionDialogOpen: data.setIsContributionDialogOpen,
    setSelectedContributionMember: data.setSelectedContributionMember,
    setIsTitleDialogOpen: data.setIsTitleDialogOpen,
    setSelectedTitleMember: data.setSelectedTitleMember,
    setIsContributionTitleDialogOpen: data.setIsContributionTitleDialogOpen,
    setIsRelationDialogOpen: data.setIsRelationDialogOpen,
    setIsCurrentMember: data.setIsCurrentMember,
    ...actions,
  };
}
