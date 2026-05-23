import { useMemo } from 'react';

import { useDialog } from '@/app/dialog/useDialog';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type { ClubPublicProfile } from '@/pages/PublicShared/objects';
import type { DetailState } from '@/pages/PublicShared/objects/types';

import { useClubDetailActions } from './club-detail.actions';
import { useClubDetailData } from './club-detail.data';
import { buildClubDetailWorkbench } from './club-detail.workbench-state';

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
    session,
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
    setIsCurrentMember: data.setIsCurrentMember,
    ...actions,
  };
}
