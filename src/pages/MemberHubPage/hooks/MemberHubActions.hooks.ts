import type { Dispatch, SetStateAction } from 'react';

import { useDialog } from '@/app/dialog/useDialog';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import { useNotice } from '@/app/feedback/useNotice';

import {
  getActiveOperator,
  reviewApplication,
  type MemberHubOperatorDirectory,
  type MemberHubState,
} from '../objects/data';

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
      const result = await reviewApplication(
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
