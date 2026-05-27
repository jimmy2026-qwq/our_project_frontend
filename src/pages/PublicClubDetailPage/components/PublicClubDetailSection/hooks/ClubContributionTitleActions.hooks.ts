import {
  AdjustClubMemberContributionAPI,
  AssignClubTitleAPI,
  ClearClubTitleAPI,
  UpdateClubRankTreeAPI,
} from '@/api/club';
import { sendAPI } from '@/system/api';

import type {
  ClubAdminMemberEntry,
  ClubContributionTitleDraft,
} from '../../../objects/club-detail.types';
import type { ClubDetailActionContext } from './ClubDetailActions.types';

export function useClubContributionTitleActions({
  data,
  notifyMutationResult,
  onRefreshDetail,
  profile,
  workbench,
}: ClubDetailActionContext) {
  const {
    canAdjustContributions,
    canEditTitles,
    refreshClubMembers,
    setContributionChangesRefreshKey,
    setIsContributionDialogOpen,
    setIsContributionSubmitting,
    setIsContributionTitleDialogOpen,
    setIsContributionTitleSubmitting,
    setContributionTitleRefreshKey,
    setIsTitleDialogOpen,
    setIsTitleSubmitting,
    setSelectedContributionMember,
    setSelectedTitleMember,
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

  async function handleUpdateTitle(
    member: ClubAdminMemberEntry,
    nextTitle: string,
  ) {
    if (!profile?.id || !workbench?.operatorId || !canEditTitles) {
      return;
    }

    const normalizedTitle = nextTitle.trim();
    setIsTitleSubmitting(true);

    try {
      if (normalizedTitle) {
        await sendAPI(
          new AssignClubTitleAPI(profile.id, {
            playerId: member.playerId,
            operatorId: workbench.operatorId,
            title: normalizedTitle,
          }),
        );
      } else {
        await sendAPI(
          new ClearClubTitleAPI(profile.id, member.playerId, {
            operatorId: workbench.operatorId,
          }),
        );
      }

      notifyMutationResult(
        { source: 'api' as const },
        {
          successTitle: normalizedTitle ? '头衔已更新' : '头衔已清除',
          successMessage: `${member.displayName} 的专属头衔已经更新。`,
          fallbackTitle: '头衔更新需要关注',
          fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
        },
      );

      setIsTitleDialogOpen(false);
      setSelectedTitleMember(null);
      await refreshClubMembers();
      onRefreshDetail?.();
    } finally {
      setIsTitleSubmitting(false);
    }
  }

  async function handleUpdateContributionTitles(
    drafts: ClubContributionTitleDraft[],
  ) {
    if (!profile?.id || !workbench?.operatorId || !canEditTitles) {
      return;
    }

    const normalizedDrafts = drafts
      .map((draft) => ({
        rankCode: draft.rankCode.trim(),
        label: draft.label.trim(),
      }))
      .filter((draft) => draft.rankCode && draft.label);

    if (normalizedDrafts.length === 0) {
      return;
    }

    setIsContributionTitleSubmitting(true);

    try {
      const labelByRankCode = new Map(
        normalizedDrafts.map((draft) => [draft.rankCode, draft.label]),
      );

      await sendAPI(
        new UpdateClubRankTreeAPI(profile.id, {
          operatorId: workbench.operatorId,
          ranks: workbench.contributionTitleFields.map((field) => ({
            code: field.rankCode,
            label: labelByRankCode.get(field.rankCode) ?? field.displayLabel,
            minimumContribution: field.minimumContribution ?? 0,
            privileges: field.privileges ?? [],
          })),
          note: '更新俱乐部通用贡献头衔',
        }),
      );

      notifyMutationResult(
        { source: 'api' as const },
        {
          successTitle: '通用头衔已更新',
          successMessage: '成员列表会按新的贡献头衔显示。',
          fallbackTitle: '通用头衔更新需要关注',
          fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
        },
      );

      setContributionTitleRefreshKey((current) => current + 1);
      setIsContributionTitleDialogOpen(false);
      await refreshClubMembers();
      onRefreshDetail?.();
    } catch (error) {
      notifyMutationResult(
        {
          source: 'mock' as const,
          warning:
            error instanceof Error
              ? error.message
              : '当前账号可能没有更新该俱乐部等级头衔的权限。',
        },
        {
          successTitle: '通用头衔已更新',
          successMessage: '成员列表会按新的贡献头衔显示。',
          fallbackTitle: '通用头衔未能保存',
          fallbackMessage:
            '请确认当前账号拥有该俱乐部的运营管理权限。',
        },
      );
    } finally {
      setIsContributionTitleSubmitting(false);
    }
  }

  return {
    handleAdjustContribution,
    handleUpdateTitle,
    handleUpdateContributionTitles,
  };
}
