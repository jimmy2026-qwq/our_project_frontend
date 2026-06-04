import { useEffect } from 'react';

import { useRefreshNotice } from '@/app/feedback/useRefreshNotice';
import type {
  HomeDataState,
  LeaderboardDataState,
} from '../objects/PublicHallPage.types';

const PUBLIC_HALL_REFRESH_NOTICE = {
  failureTitle: '公共大厅刷新失败',
  successTitle: '公共大厅已刷新',
  successMessage: '公共大厅数据已重新加载。',
  fallbackTitle: '公共大厅刷新存在提醒',
  fallbackMessage: '部分公共大厅面板暂时无法确认，请稍后再试。',
};

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
