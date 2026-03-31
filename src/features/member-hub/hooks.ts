import { useEffect, useState } from 'react';

import { useDialog, useNotice } from '@/hooks';
import { mockClubs } from '@/mocks/overview';

import {
  DEFAULT_MEMBER_HUB_STATE,
  getActiveOperator,
  loadClubApplicationInbox,
  loadClubDashboard,
  loadPlayerDashboard,
  normalizeClubIdForOperator,
  reviewApplication,
  type ApplicationInboxState,
  type DashboardLoadState,
  type MemberHubState,
} from './data';

export function useMemberHubState() {
  const [state, setState] = useState<MemberHubState>(DEFAULT_MEMBER_HUB_STATE);
  return { state, setState };
}

export function useMemberHubData(state: MemberHubState, reloadKey = 0) {
  const [playerPayload, setPlayerPayload] = useState<DashboardLoadState | null>(null);
  const [clubPayload, setClubPayload] = useState<DashboardLoadState | null>(null);
  const [inboxPayload, setInboxPayload] = useState<ApplicationInboxState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      const activeOperator = getActiveOperator(state.operatorId);
      const clubId = normalizeClubIdForOperator(state);

      const [nextPlayerPayload, nextClubPayload, nextInboxPayload] = await Promise.all([
        loadPlayerDashboard(state.playerId, state.operatorId),
        loadClubDashboard(clubId, state.operatorId),
        loadClubApplicationInbox(clubId, state.operatorId, activeOperator.role),
      ]);

      if (!cancelled) {
        setPlayerPayload(nextPlayerPayload);
        setClubPayload(nextClubPayload);
        setInboxPayload(nextInboxPayload);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey, state]);

  return { playerPayload, clubPayload, inboxPayload, isLoading };
}

export function useMemberHubActions(
  state: MemberHubState,
  setState: React.Dispatch<React.SetStateAction<MemberHubState>>,
  reload: () => void,
) {
  const { confirm } = useDialog();
  const { notifySuccess, notifyWarning } = useNotice();

  async function changeOperator(operatorId: string) {
    const activeOperator = getActiveOperator(operatorId);
    setState((current) => ({
      ...current,
      operatorId,
      playerId: activeOperator.playerId,
      clubId: activeOperator.managedClubIds[0] ?? mockClubs[0].id,
    }));
  }

  function changePlayer(playerId: string) {
    setState((current) => ({ ...current, playerId }));
  }

  function changeClub(clubId: string) {
    setState((current) => ({ ...current, clubId }));
  }

  async function handleReview(applicationId: string, decision: 'approve' | 'reject') {
    const confirmed = await confirm({
      title: decision === 'approve' ? 'Approve this application?' : 'Reject this application?',
      message:
        decision === 'approve'
          ? 'This will update the membership review result and refresh the inbox.'
          : 'This will reject the request and refresh the inbox.',
      confirmText: decision === 'approve' ? 'Approve' : 'Reject',
      tone: 'danger',
    });

    if (!confirmed) {
      return;
    }

    await reviewApplication(state.clubId, applicationId, state.operatorId, decision);
    if (decision === 'approve') {
      notifySuccess('Application approved', 'The member hub queue was updated and reloaded.');
    } else {
      notifyWarning('Application rejected', 'The member hub queue was updated and reloaded.');
    }
    reload();
  }

  return {
    changeOperator,
    changePlayer,
    changeClub,
    handleReview,
  };
}
