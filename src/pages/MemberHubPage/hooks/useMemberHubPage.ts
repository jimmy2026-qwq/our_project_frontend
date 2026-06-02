import { useReducer } from 'react';

import { useRealtimeRefresh } from '@/app/realtime/useRealtimeRefresh';

import { getActiveOperator } from '../functions/getMemberHubOperator';
import { DEFAULT_MEMBER_HUB_DIRECTORY } from '../objects/MemberHub.types';
import { useMemberHubActions } from './useMemberHubActions';
import { useMemberHubData } from './useMemberHubData';
import { useMemberHubState } from './useMemberHubState';

export function useMemberHubPage() {
  const { state, setState, directory } = useMemberHubState();
  const [reloadKey, forceReload] = useReducer((value: number) => value + 1, 0);
  useRealtimeRefresh(
    [
      'ClubChanged',
      'ClubApplicationChanged',
      'ClubMemberChanged',
      'PlayerChanged',
      'TournamentChanged',
    ],
    () => forceReload(),
  );
  const {
    playerDashboardState,
    clubDashboardState,
    applicationInboxState,
    isLoading,
  } = useMemberHubData(directory, state, reloadKey);
  const actions = useMemberHubActions(
    directory ?? DEFAULT_MEMBER_HUB_DIRECTORY,
    state,
    setState,
    forceReload,
  );
  const activeOperator = directory
    ? getActiveOperator(directory, state.operatorId)
    : null;

  return {
    directory,
    state,
    activeOperator,
    playerDashboardState,
    clubDashboardState,
    applicationInboxState,
    isLoading:
      !directory ||
      isLoading ||
      !playerDashboardState ||
      !clubDashboardState ||
      !applicationInboxState,
    actions,
    onReload: forceReload,
  };
}
