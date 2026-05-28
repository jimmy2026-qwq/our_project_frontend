import { useEffect, useState } from 'react';

import { getActiveOperator } from '../functions/getMemberHubOperator';
import { loadClubApplicationInbox } from '../functions/loadMemberHubApplicationInbox';
import {
  loadClubDashboard,
  loadPlayerDashboard,
} from '../functions/loadMemberHubDashboard';
import { normalizeMemberHubClubId } from '../functions/normalizeMemberHubClubId';
import type {
  ApplicationInboxState,
  DashboardLoadState,
  MemberHubOperatorDirectory,
  MemberHubState,
} from '../objects/MemberHub.types';

export function useMemberHubData(
  directory: MemberHubOperatorDirectory | null,
  state: MemberHubState,
  reloadKey = 0,
) {
  const [playerDashboardState, setPlayerDashboardState] =
    useState<DashboardLoadState | null>(null);
  const [clubDashboardState, setClubDashboardState] =
    useState<DashboardLoadState | null>(null);
  const [applicationInboxState, setApplicationInboxState] =
    useState<ApplicationInboxState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!directory) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      const activeOperator = getActiveOperator(directory, state.operatorId);
      const clubId = normalizeMemberHubClubId(directory, state);
      const [
        nextPlayerDashboardState,
        nextClubDashboardState,
        nextApplicationInboxState,
      ] = await Promise.all([
        loadPlayerDashboard(state.playerId, state.operatorId),
        loadClubDashboard(clubId, state.operatorId),
        loadClubApplicationInbox(
          clubId,
          state.operatorId,
          activeOperator.role,
        ),
      ]);

      if (!cancelled) {
        setPlayerDashboardState(nextPlayerDashboardState);
        setClubDashboardState(nextClubDashboardState);
        setApplicationInboxState(nextApplicationInboxState);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [directory, reloadKey, state]);

  return {
    playerDashboardState,
    clubDashboardState,
    applicationInboxState,
    isLoading,
  };
}
