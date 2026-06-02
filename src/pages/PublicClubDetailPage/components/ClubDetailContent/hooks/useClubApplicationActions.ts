import { ReviewClubApplicationAPI } from '@/api/club';
import type { ClubApplication } from '@/pages/objects/ClubApplicationViews';
import { sendAPI } from '@/system/api';

import { upsertTrackedClubApplication } from '../../../functions/getClubApplicationTracker';
import { toClubApplicationView } from '../../../objects/ClubDetailApplication.mappers';
import type { ClubDetailActionContext } from './useClubDetailActions.types';

export function useClubApplicationActions({
  confirmDanger,
  data,
  notifyMutationResult,
  workbench,
}: ClubDetailActionContext) {
  const {
    canReviewApplications,
    setApplicationInbox,
    setCurrentApplicationStatus,
  } = data;

  async function handleReview(
    applicationId: string,
    decision: 'approve' | 'reject',
  ) {
    if (
      !workbench?.profile.id ||
      !workbench.operatorId ||
      !canReviewApplications
    ) {
      return;
    }

    const confirmed = await confirmDanger({
      title: decision === 'approve' ? '确认通过申请？' : '确认拒绝申请？',
      message:
        decision === 'approve'
          ? '这会立刻通过当前待处理申请，并把它从申请列表里移除。'
          : '这会立刻拒绝当前待处理申请，并把它从申请列表里移除。',
      confirmText: decision === 'approve' ? '通过' : '拒绝',
    });

    if (!confirmed) {
      return;
    }

    try {
      const result = await sendAPI(
        new ReviewClubApplicationAPI(workbench.profile.id, applicationId, {
          operatorId: workbench.operatorId,
          decision,
          note: `${decision}d from club detail`,
        }),
      )
        .then(toClubApplicationView)
        .then((reviewedApplication) => {
          upsertTrackedClubApplication({
            id: reviewedApplication.applicationId,
            clubId: reviewedApplication.clubId,
            clubName: reviewedApplication.clubName,
            playerId: reviewedApplication.applicant.playerId,
            applicantName: reviewedApplication.applicant.displayName,
            message: reviewedApplication.message,
            status: reviewedApplication.status,
            submittedAt: reviewedApplication.submittedAt,
            source: 'api',
          });

          return { source: 'api' as const };
        });

      notifyMutationResult(result, {
        successTitle: decision === 'approve' ? '申请已通过' : '申请已拒绝',
        successMessage: '申请列表已经更新。',
        fallbackTitle:
          decision === 'approve'
            ? '通过申请需要人工确认'
            : '拒绝申请需要人工确认',
        fallbackMessage: '后端处理这次申请时没有完全成功。',
      });

      setApplicationInbox((current) =>
        current.filter((item) => item.applicationId !== applicationId),
      );

      if (decision === 'reject') {
        setCurrentApplicationStatus('Rejected');
      }
    } catch (error) {
      notifyMutationResult(
        {
          warning:
            error instanceof Error ? error.message : '审核申请时发生未知错误。',
        },
        {
          successTitle: decision === 'approve' ? '申请已通过' : '申请已拒绝',
          successMessage: '申请列表已经更新。',
          fallbackTitle:
            decision === 'approve' ? '无法通过申请' : '无法拒绝申请',
          fallbackMessage: '请检查当前账号权限和申请状态后再试。',
        },
      );
    }
  }

  function handleApplicationStatusChange(
    status: ClubApplication['status'] | null,
  ) {
    setCurrentApplicationStatus(status);
  }

  return {
    handleApplicationStatusChange,
    handleReview,
  };
}
