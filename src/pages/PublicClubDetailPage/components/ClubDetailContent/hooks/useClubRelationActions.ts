import {
  SubmitClubRelationRequestAPI,
} from '@/api/club/SubmitClubRelationRequestAPI';
import { UpdateClubRelationAPI } from '@/api/club/UpdateClubRelationAPI';
import type { ClubRelationKind } from '@/objects/club';
import { sendAPI } from '@/system/api';

import type { ClubDetailActionContext } from './useClubDetailActions.types';

export interface ClubRelationDraft {
  targetClubId: string;
  relation: ClubRelationKind;
  note?: string;
}

export function useClubRelationActions({
  data,
  notifyMutationResult,
  onRefreshDetail,
  profile,
  workbench,
}: ClubDetailActionContext) {
  const { setIsRelationDialogOpen, setIsRelationSubmitting } = data;

  async function handleUpdateRelation(draft: ClubRelationDraft) {
    if (
      !profile?.id ||
      !workbench?.operatorId ||
      (!workbench.canManageRelations && !workbench.canRequestRelationChange)
    ) {
      return;
    }

    const targetClubId = draft.targetClubId.trim();

    if (!targetClubId || targetClubId === profile.id) {
      return;
    }

    setIsRelationSubmitting(true);

    try {
      if (workbench.canManageRelations) {
        await sendAPI(
          new UpdateClubRelationAPI(profile.id, {
            operatorId: workbench.operatorId,
            targetClubId,
            relation: draft.relation,
            note: draft.note?.trim() || undefined,
          }),
        );
      } else {
        await sendAPI(
          new SubmitClubRelationRequestAPI(profile.id, {
            operatorId: workbench.operatorId,
            targetClubId,
            relation: draft.relation,
            note: draft.note?.trim() || undefined,
          }),
        );
      }

      notifyMutationResult(
        { source: 'api' as const },
        workbench.canManageRelations
          ? {
              successTitle:
                draft.relation === 'Neutral' ? '关系已清除' : '关系已更新',
              successMessage:
                draft.relation === 'Neutral'
                  ? '两家俱乐部之间的关系已经恢复中立。'
                  : '两家俱乐部之间的关系已经同步更新。',
              fallbackTitle: '关系更新需要关注',
              fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
            }
          : {
              successTitle: '申请已提交',
              successMessage: '关系调整申请已经发送给平台超管。',
              fallbackTitle: '申请需要关注',
              fallbackMessage: '后端没有确认申请，请稍后刷新系统消息。',
            },
      );

      setIsRelationDialogOpen(false);
      onRefreshDetail?.();
    } catch (error) {
      notifyMutationResult(
        {
          source: 'mock' as const,
          warning:
            error instanceof Error
              ? error.message
              : '当前账号可能没有管理该俱乐部关系的权限。',
        },
        {
          successTitle: workbench.canManageRelations
            ? '关系已更新'
            : '申请已提交',
          successMessage: workbench.canManageRelations
            ? '两家俱乐部之间的关系已经同步更新。'
            : '关系调整申请已经发送给平台超管。',
          fallbackTitle: workbench.canManageRelations
            ? '关系未能保存'
            : '申请未能提交',
          fallbackMessage: workbench.canManageRelations
            ? '请确认当前账号是平台超管。'
            : '请确认当前账号是该俱乐部管理员。',
        },
      );
    } finally {
      setIsRelationSubmitting(false);
    }
  }

  return {
    handleUpdateRelation,
  };
}
