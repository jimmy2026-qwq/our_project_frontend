import { useMemo } from 'react';

import { useDialog } from '@/app/dialog/useDialog';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type { ClubPublicProfile } from '../../../objects/types';
import type { DetailState } from '../../../objects/types';

import { useClubDetailActions } from './ClubDetailActions.hooks';
import { useClubDetailData } from './ClubDetailData.hooks';
import { buildClubDetailWorkbench } from '../objects/club-detail.workbench';

interface UseClubDetailWorkbenchParams {
  state: DetailState<ClubPublicProfile>;
  session: AuthSession | null;
  onRefreshDetail?: () => void;
}

export function useClubDetailWorkbench({
  state,
  session,
  onRefreshDetail,
}: UseClubDetailWorkbenchParams) {
  const { confirmDanger } = useDialog();
  const { notifyMutationResult } = useMutationNotice();
  const profile = state.item;
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
    setIsCurrentMember: data.setIsCurrentMember,
    ...actions,
  };
}
