import { useEffect } from 'react';

import { useRefreshNotice } from '@/app/feedback/useRefreshNotice';

import type { HomeDataState } from '../objects/state/HomeDataState';
import { LeaderboardDataState } from '../objects/state/LeaderboardDataState';
import { PUBLIC_HALL_REFRESH_NOTICE } from '../objects/PublicHallRefreshNotice';

export function usePublicHallRefreshNotice({
  data,
  error,
  isLoading,
  leaderboardData,
  pendingRefresh,
  onRefreshHandled,
}: {
  data: HomeDataState | null;
  error: string | null;
  isLoading: boolean;
  leaderboardData: LeaderboardDataState | null;
  pendingRefresh: boolean;
  onRefreshHandled: () => void;
}) {
  const { notifyRefreshResult } = useRefreshNotice();

  useEffect(() => {
    if (!pendingRefresh || isLoading) {
      return;
    }

    if (error && !data) {
      notifyRefreshResult([], PUBLIC_HALL_REFRESH_NOTICE, error);
      onRefreshHandled();
      return;
    }

    if (!data) {
      return;
    }

    notifyRefreshResult(
      [
        data.schedules,
        data.clubs,
        ...(leaderboardData ? [leaderboardData.leaderboard] : []),
      ],
      PUBLIC_HALL_REFRESH_NOTICE,
      error,
    );

    onRefreshHandled();
  }, [
    data,
    error,
    isLoading,
    leaderboardData,
    notifyRefreshResult,
    onRefreshHandled,
    pendingRefresh,
  ]);
}
