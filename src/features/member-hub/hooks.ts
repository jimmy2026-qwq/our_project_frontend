import { useEffect, useState } from 'react';

import { useDialog, useMutationNotice } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';

import {
  createMemberHubState,
  DEFAULT_MEMBER_HUB_STATE,
  getActiveOperator,
  loadClubApplicationInbox,
  loadClubDashboard,
  loadMemberHubOperatorDirectory,
  loadPlayerDashboard,
  normalizeClubIdForOperator,
  reviewApplication,
  type ApplicationInboxState,
  type DashboardLoadState,
  type MemberHubOperatorDirectory,
  type MemberHubState,
} from './data';

export function useMemberHubState() {
  const { session } = useAuth();
  const [directory, setDirectory] = useState<MemberHubOperatorDirectory | null>(null);
  const [state, setState] = useState<MemberHubState>(DEFAULT_MEMBER_HUB_STATE);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const nextDirectory = await loadMemberHubOperatorDirectory(session);

      if (!cancelled) {
        setDirectory(nextDirectory);
        setState((current) =>
          createMemberHubState(nextDirectory, current.operatorId || session?.user.operatorId || session?.user.userId),
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  return { state, setState, directory };
}

export function useMemberHubData(directory: MemberHubOperatorDirectory | null, state: MemberHubState, reloadKey = 0) {
  const [playerPayload, setPlayerPayload] = useState<DashboardLoadState | null>(null);
  const [clubPayload, setClubPayload] = useState<DashboardLoadState | null>(null);
  const [inboxPayload, setInboxPayload] = useState<ApplicationInboxState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!directory) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      const activeOperator = getActiveOperator(directory, state.operatorId);
      const clubId = normalizeClubIdForOperator(directory, state);

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
  }, [directory, reloadKey, state]);

  return { playerPayload, clubPayload, inboxPayload, isLoading };
}

export function useMemberHubActions(
  directory: MemberHubOperatorDirectory,
  state: MemberHubState,
  setState: React.Dispatch<React.SetStateAction<MemberHubState>>,
  reload: () => void,
) {
  const { confirmDanger } = useDialog();
  const { notifyMutationResult } = useMutationNotice();

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

  async function handleReview(applicationId: string, decision: 'approve' | 'reject') {
    const confirmed = await confirmDanger({
      title: decision === 'approve' ? 'Approve this application?' : 'Reject this application?',
      message:
        decision === 'approve'
          ? 'This will update the membership review result and refresh the inbox.'
          : 'This will reject the request and refresh the inbox.',
      confirmText: decision === 'approve' ? 'Approve' : 'Reject',
    });

    if (!confirmed) {
      return;
    }

    const result = await reviewApplication(state.clubId, applicationId, state.operatorId, decision);
    notifyMutationResult(result, {
      successTitle: decision === 'approve' ? 'Application approved' : 'Application rejected',
      successMessage: 'The member hub queue was updated and reloaded.',
      fallbackTitle:
        decision === 'approve' ? 'Application approved with fallback' : 'Application rejected with fallback',
      fallbackMessage: 'The member hub review used the local inbox fallback.',
    });
    reload();
  }

  return {
    changeOperator,
    changePlayer,
    changeClub,
    handleReview,
  };
}
