import { type Dispatch, type SetStateAction } from 'react';

import { ReviewClubApplicationAPI } from '@/api/club/membership/ReviewClubApplicationAPI';
import { useConfirmationDialogActions } from '@/components/confirmation-dialog/useConfirmationDialogActions';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import { useNotice } from '@/app/feedback/useNotice';
import { ClubApplicationReviewDecisions, type ClubApplicationReviewDecision, type ClubMembershipApplicationView } from '@/objects';
import type { ReviewClubApplicationRequest } from '@/objects/club/membership/apiTypes';
import { sendAPI } from '@/system/api';

import { upsertMemberHubApplicationInboxItem } from '../functions/getMemberHubApplicationInboxBridge';
import { getActiveOperator } from '../functions/getMemberHubOperator';
import { toClubApplicationView } from '../functions/toMemberHubData';
import type { MemberHubOperatorDirectory } from '../objects/operator/MemberHubOperatorDirectory';
import type { MemberHubState } from '../objects/state/MemberHubState';

function reviewClubApplication(
  clubId: string,
  membershipId: string,
  payload: ReviewClubApplicationRequest,
) {
  return sendAPI<ClubMembershipApplicationView>(
    new ReviewClubApplicationAPI(clubId, membershipId, payload),
  ).then(toClubApplicationView);
}

async function reviewMemberHubApplication(
  clubId: string,
  applicationId: string,
  operatorId: string,
  decision: ClubApplicationReviewDecision,
) {
  const application = await reviewClubApplication(clubId, applicationId, {
    operatorId,
    decision,
    note: `${decision}d from member hub`,
  });
  upsertMemberHubApplicationInboxItem({
    id: application.applicationId,
    clubId: application.clubId,
    clubName: application.clubName,
    playerId: application.applicant.playerId,
    applicantName: application.applicant.displayName,
    message: application.message,
    status: application.status,
    submittedAt: application.submittedAt,
  });
  return {};
}

export function useMemberHubActions(
  directory: MemberHubOperatorDirectory,
  state: MemberHubState,
  setState: Dispatch<SetStateAction<MemberHubState>>,
  reload: () => void,
) {
  const { confirmDanger } = useConfirmationDialogActions();
  const { notifyMutationResult } = useMutationNotice();
  const { notifyWarning } = useNotice();

  async function changeOperator(operatorId: string) {
    const activeOperator = getActiveOperator(directory, operatorId);
    setState((current) => ({
      ...current,
      operatorId,
      playerId: activeOperator.playerId,
      clubId: activeOperator.managedClubIds[0] ?? current.clubId,
    }));
  }

  function changePlayer(playerId: string) {
    setState((current) => ({ ...current, playerId }));
  }

  function changeClub(clubId: string) {
    setState((current) => ({ ...current, clubId }));
  }

  async function handleReview(
    applicationId: string,
    decision: ClubApplicationReviewDecision,
  ) {
    const isApprove = decision === ClubApplicationReviewDecisions.Approve;
    const confirmed = await confirmDanger({
      title:
        isApprove
          ? 'Approve this application?'
          : 'Reject this application?',
      message:
        isApprove
          ? 'This will update the membership review result and refresh the inbox.'
          : 'This will reject the request and refresh the inbox.',
      confirmText: isApprove ? 'Approve' : 'Reject',
    });

    if (!confirmed) {
      return;
    }

    try {
      const result = await reviewMemberHubApplication(
        state.clubId,
        applicationId,
        state.operatorId,
        decision,
      );
      notifyMutationResult(result, {
        successTitle:
          isApprove
            ? 'Application approved'
            : 'Application rejected',
        successMessage: 'The member hub queue was updated and reloaded.',
        fallbackTitle:
          isApprove
            ? 'Application approval requires attention'
            : 'Application rejection requires attention',
        fallbackMessage: 'The review result could not be confirmed.',
      });
      reload();
    } catch (error) {
      notifyWarning(
        isApprove
          ? 'Unable to approve application'
          : 'Unable to reject application',
        error instanceof Error
          ? error.message
          : 'The review request did not complete.',
      );
    }
  }

  return {
    changeOperator,
    changePlayer,
    changeClub,
    handleReview,
  };
}
