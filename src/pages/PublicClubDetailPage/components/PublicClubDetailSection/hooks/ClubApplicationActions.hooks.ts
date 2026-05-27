import { ReviewClubApplicationAPI } from '@/api/club';
import {
  mapClubApplicationView,
  type ClubApplication,
} from '@/pages/objects/club';
import { upsertClubApplicationInboxItem } from '@/pages/objects/club';
import { sendAPI } from '@/system/api';

import type { ClubDetailActionContext } from './ClubDetailActions.types';

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
    if (!workbench?.profile.id || !workbench.operatorId || !canReviewApplications) {
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

    const application = workbench.applicationInbox.find(
      (item) => item.applicationId === applicationId,
    );

    const result = await sendAPI(
      new ReviewClubApplicationAPI(workbench.profile.id, applicationId, {
        operatorId: workbench.operatorId,
        decision,
        note: `${decision}d from club detail`,
        ...(decision === 'approve' && application?.applicant.playerId
          ? { playerId: application.applicant.playerId }
          : {}),
      }),
    )
      .then(mapClubApplicationView)
      .then((reviewedApplication) => {
        upsertClubApplicationInboxItem({
          id: reviewedApplication.applicationId,
          clubId: reviewedApplication.clubId,
          clubName: reviewedApplication.clubName,
          operatorId:
            reviewedApplication.applicant.playerId ||
            reviewedApplication.applicant.applicantUserId ||
            '',
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
