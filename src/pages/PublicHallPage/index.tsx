import { useCallback, useReducer, useState } from 'react';

import { useAuth } from '@/app/auth/useAuth';
import type { PublicHallState, PublicView } from './objects/types';

import { PublicHallActiveView } from './components/PublicHallActiveView';
import {
  PublicHallError,
  PublicHallLoading,
} from './components/PublicHallLoadingState';
import { PublicHallLobby } from './components/PublicHallLobby';
import {
  usePublicHallCurrentPlayer,
  usePublicHallHomeData,
  usePublicHallLeaderboardData,
  usePublicHallRefreshNotice,
  usePublicHallState,
} from './hooks';

export function PublicHallHomePage() {
  const { state, setState } = usePublicHallState();
  const { session } = useAuth();
  const operatorId = session?.user.operatorId ?? '';
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const { data, isLoading, error } = usePublicHallHomeData(
    state,
    { session },
    reloadKey,
  );
  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    error: leaderboardError,
  } = usePublicHallLeaderboardData(state, data, reloadKey);
  const { data: currentPlayer } = usePublicHallCurrentPlayer(
    session,
    operatorId,
  );
  const handleRefreshHandled = useCallback(() => {
    setPendingRefresh(false);
  }, []);

  usePublicHallRefreshNotice({
    data,
    error,
    isLoading,
    leaderboardData,
    pendingRefresh,
    onRefreshHandled: handleRefreshHandled,
  });

  const handleStateChange = useCallback(
    (patch: Partial<PublicHallState>) => {
      setState((current) => ({ ...current, ...patch }));
    },
    [setState],
  );
  const handleActiveViewChange = useCallback(
    (activeView: PublicView) => {
      handleStateChange({ activeView });
    },
    [handleStateChange],
  );
  const handleRefresh = useCallback(() => {
    setPendingRefresh(true);
    forceReload();
  }, []);

  if (isLoading && !data) {
    return <PublicHallLoading />;
  }

  if (error && !data) {
    return <PublicHallError message={error} />;
  }

  if (!data) {
    return <PublicHallError message="当前无法获取公共大厅数据。" />;
  }

  const canCreateClub = !!session?.user.roles.isRegisteredPlayer;
  const canCreateTournament = !!session?.user.roles.isSuperAdmin;
  const canManagePlayers = !!session?.user.roles.isSuperAdmin;
  const displayName =
    currentPlayer?.displayName ??
    session?.user.displayName ??
    session?.user.username ??
    'Guest Player';
  const eloText = currentPlayer?.elo ? `${currentPlayer.elo}` : 'Guest';
  const showLoginEntry =
    !session ||
    session.user.roles.isGuest ||
    !session.user.roles.isRegisteredPlayer;
  const lobbyEntries = [
    {
      id: 'schedules' as const,
      label: '赛事大厅',
      heading: '公开赛程',
      detail: `${data.schedules.envelope.total} schedules`,
    },
    {
      id: 'clubs' as const,
      label: '魂之一击',
      heading: '俱乐部名录',
      detail: `${data.clubs.envelope.total} clubs`,
    },
    {
      id: 'leaderboard' as const,
      label: '强者之路',
      heading: '选手排名',
      detail: leaderboardData
        ? `${leaderboardData.leaderboard.envelope.total} players`
        : 'Leaderboard standby',
    },
  ];

  return (
    <PublicHallLobby
      activeView={state.activeView}
      activeViewMarkup={
        <PublicHallActiveView
          data={data}
          state={state}
          isLeaderboardLoading={isLeaderboardLoading}
          leaderboardData={leaderboardData}
          leaderboardError={leaderboardError}
          canCreateClub={canCreateClub}
          canCreateTournament={canCreateTournament}
          canManagePlayers={canManagePlayers}
          onStateChange={handleStateChange}
          onRefresh={handleRefresh}
          onPlayerManaged={forceReload}
        />
      }
      displayName={displayName}
      eloText={eloText}
      entries={lobbyEntries}
      showLoginEntry={showLoginEntry}
      onActiveViewChange={handleActiveViewChange}
    />
  );
}
