import { useMemo } from 'react';

import { useDialog } from '@/app/dialog/useDialog';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type {
  ClubPublicProfile,
  DetailState,
} from '../../../objects/PublicClubDetailPage.types';

import { useClubDetailActions } from './useClubDetailActions';
import { useClubDetailData } from './useClubDetailData';
import { buildClubDetailWorkbench } from '../functions/buildClubDetailWorkbench';

interface UseClubDetailWorkbenchParams {
  state: DetailState<ClubPublicProfile> | null;
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
    setIsCurrentMember: data.setIsCurrentMember,
    ...actions,
  };
}
