import { useEffect } from 'react';

import { useRefreshNotice } from '@/app/feedback/useRefreshNotice';
import type {
  HomeDataState,
  LeaderboardDataState,
} from '../objects/PublicHallPage.types';

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
      notifyRefreshResult(
        [],
        {
          failureTitle: 'Public hall refresh failed',
          successTitle: 'Public hall refreshed',
          successMessage: 'Live public hall data was reloaded successfully.',
          fallbackTitle: 'Public hall refreshed with warnings',
          fallbackMessage: 'Some public hall panels could not be confirmed.',
        },
        error,
      );
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
      {
        failureTitle: 'Public hall refresh failed',
        successTitle: 'Public hall refreshed',
        successMessage: 'Live public hall data was reloaded successfully.',
        fallbackTitle: 'Public hall refreshed with warnings',
        fallbackMessage: 'Some public hall panels could not be confirmed.',
      },
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
