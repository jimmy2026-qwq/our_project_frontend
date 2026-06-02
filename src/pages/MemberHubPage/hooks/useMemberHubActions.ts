import type { Dispatch, SetStateAction } from 'react';

import { ReviewClubApplicationAPI } from '@/api/club/ReviewClubApplicationAPI';
import { useDialog } from '@/app/dialog/useDialog';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import { useNotice } from '@/app/feedback/useNotice';
import type {
  ClubMembershipApplicationView,
  ReviewClubApplicationRequest,
} from '@/objects';
import { sendAPI } from '@/system/api';

import { getActiveOperator } from '../functions/getMemberHubOperator';
import { upsertMemberHubApplicationInboxItem } from '../functions/getMemberHubApplicationInboxBridge';
import { toClubApplicationView } from '../objects/MemberHub.mappers';
import type {
  MemberHubOperatorDirectory,
  MemberHubState,
} from '../objects/MemberHub.types';

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
  decision: 'approve' | 'reject',
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
    source: 'api',
  });
  return { source: 'api' as const };
}

export function useMemberHubActions(
  directory: MemberHubOperatorDirectory,
  state: MemberHubState,
  setState: Dispatch<SetStateAction<MemberHubState>>,
  reload: () => void,
) {
  const { confirmDanger } = useDialog();
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
    decision: 'approve' | 'reject',
  ) {
    const confirmed = await confirmDanger({
      title:
        decision === 'approve'
          ? 'Approve this application?'
          : 'Reject this application?',
      message:
        decision === 'approve'
          ? 'This will update the membership review result and refresh the inbox.'
          : 'This will reject the request and refresh the inbox.',
      confirmText: decision === 'approve' ? 'Approve' : 'Reject',
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
          decision === 'approve'
            ? 'Application approved'
            : 'Application rejected',
        successMessage: 'The member hub queue was updated and reloaded.',
        fallbackTitle:
          decision === 'approve'
            ? 'Application approval requires attention'
            : 'Application rejection requires attention',
        fallbackMessage: 'The review result could not be confirmed.',
      });
      reload();
    } catch (error) {
      notifyWarning(
        decision === 'approve'
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
