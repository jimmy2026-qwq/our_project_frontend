import { useCallback, useReducer, useState } from 'react';

import { useAuth } from '@/app/auth/useAuth';

import { usePublicHallCurrentPlayer } from '../components/PublicHallLobby/hooks/usePublicHallCurrentPlayer';
import type {
  PublicHallState,
  PublicView,
} from '../objects/PublicHallPage.types';
import { usePublicHallState } from './usePublicHallState';
import { usePublicHallHomeData } from './usePublicHallHomeData';
import { usePublicHallLeaderboardData } from './usePublicHallLeaderboardData';
import { usePublicHallRefreshNotice } from './usePublicHallRefreshNotice';

export function usePublicHallPage() {
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

  const canCreateClub = !!session?.user.roles.isRegisteredPlayer;
  const canCreateTournament = !!session?.user.roles.isSuperAdmin;
  const canManagePlayers = !!session?.user.roles.isSuperAdmin;
  const displayName =
    currentPlayer?.displayName ??
    session?.user.displayName ??
    session?.user.username ??
    '游客玩家';
  const eloText = typeof currentPlayer?.elo === 'number' ? String(currentPlayer.elo) : '游客';
  const showLoginEntry =
    !session ||
    session.user.roles.isGuest ||
    !session.user.roles.isRegisteredPlayer;
  const lobbyEntries = [
    {
      id: 'schedules' as const,
      label: '赛事大厅',
      heading: '公开赛程',
      detail: data ? `${data.schedules.envelope.total} 场赛程` : '',
    },
    {
      id: 'clubs' as const,
      label: '俱乐部',
      heading: '俱乐部名录',
      detail: data ? `${data.clubs.envelope.total} 家俱乐部` : '',
    },
    {
      id: 'leaderboard' as const,
      label: '排行榜',
      heading: '选手排名',
      detail: leaderboardData
        ? `${leaderboardData.leaderboard.envelope.total} 名选手`
        : '排行榜待加载',
    },
  ];

  return {
    activeView: state.activeView,
    canCreateClub,
    canCreateTournament,
    canManagePlayers,
    data,
    displayName,
    eloText,
    error,
    isLeaderboardLoading,
    isLoading,
    leaderboardData,
    leaderboardError,
    lobbyEntries,
    showLoginEntry,
    state,
    onActiveViewChange: handleActiveViewChange,
    onPlayerManaged: forceReload,
    onRefresh: handleRefresh,
    onStateChange: handleStateChange,
  };
}
