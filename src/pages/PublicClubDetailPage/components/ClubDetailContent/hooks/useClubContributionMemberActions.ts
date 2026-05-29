import { AdjustClubMemberContributionAPI } from '@/api/club';
import { sendAPI } from '@/system/api';

import type { ClubAdminMemberEntry } from '../../../objects/ClubDetail.types';
import type { ClubDetailActionContext } from './useClubDetailActions.types';

export function useClubContributionMemberActions({
  data,
  notifyMutationResult,
  onRefreshDetail,
  profile,
  workbench,
}: ClubDetailActionContext) {
  const {
    canAdjustContributions,
    refreshClubMembers,
    setContributionChangesRefreshKey,
    setIsContributionDialogOpen,
    setIsContributionSubmitting,
    setSelectedContributionMember,
  } = data;

  async function handleAdjustContribution(
    member: ClubAdminMemberEntry,
    delta: number,
    note?: string,
  ) {
    if (!profile?.id || !workbench?.operatorId || !canAdjustContributions) {
      return;
    }

    setIsContributionSubmitting(true);

    try {
      await sendAPI(
        new AdjustClubMemberContributionAPI(profile.id, {
          playerId: member.playerId,
          operatorId: workbench.operatorId,
          delta,
          note: note?.trim() || undefined,
        }),
      );

      notifyMutationResult(
        { source: 'api' as const },
        {
          successTitle: '贡献值已更新',
          successMessage: `${member.displayName} 的贡献值变化已提交。`,
          fallbackTitle: '贡献值更新需要关注',
          fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
        },
      );

      setIsContributionDialogOpen(false);
      setSelectedContributionMember(null);
      setContributionChangesRefreshKey((current) => current + 1);
      await refreshClubMembers();
      onRefreshDetail?.();
    } finally {
      setIsContributionSubmitting(false);
    }
  }

  return { handleAdjustContribution };
}
