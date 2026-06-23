import { ReviewClubApplicationAPI } from '@/api/club';
import type { ClubApplication } from '@/pages/shared_objects/club/ClubApplication';
import { ClubApplicationReviewDecisions, ClubApplicationStatuses, type ClubApplicationReviewDecision } from '@/objects';
import { sendAPI } from '@/system/api';

import { upsertTrackedClubApplication } from '../../../functions/getClubApplicationTracker';
import { toClubApplicationView } from '../../../functions/toClubDetailApplicationData';
import type { ClubDetailActionContext } from '../objects/ClubDetailActionContext';

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
    decision: ClubApplicationReviewDecision,
  ) {
    if (
      !workbench?.profile.id ||
      !workbench.operatorId ||
      !canReviewApplications
    ) {
      return;
    }

    const isApprove = decision === ClubApplicationReviewDecisions.Approve;
    const confirmed = await confirmDanger({
      title: isApprove ? '确认通过申请？' : '确认拒绝申请？',
      message:
        isApprove
          ? '这会立刻通过当前待处理申请，并把它从申请列表里移除。'
          : '这会立刻拒绝当前待处理申请，并把它从申请列表里移除。',
      confirmText: isApprove ? '通过' : '拒绝',
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
          });

          return {};
        });

      notifyMutationResult(result, {
        successTitle: isApprove ? '申请已通过' : '申请已拒绝',
        successMessage: '申请列表已经更新。',
        fallbackTitle:
          isApprove
            ? '通过申请需要人工确认'
            : '拒绝申请需要人工确认',
        fallbackMessage: '后端处理这次申请时没有完全成功。',
      });

      setApplicationInbox((current) =>
        current.filter((item) => item.applicationId !== applicationId),
      );

      if (decision === ClubApplicationReviewDecisions.Reject) {
        setCurrentApplicationStatus(ClubApplicationStatuses.Rejected);
      }
    } catch (error) {
      notifyMutationResult(
        {
          warning:
            error instanceof Error ? error.message : '审核申请时发生未知错误。',
        },
        {
          successTitle: isApprove ? '申请已通过' : '申请已拒绝',
          successMessage: '申请列表已经更新。',
          fallbackTitle:
            isApprove ? '无法通过申请' : '无法拒绝申请',
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
