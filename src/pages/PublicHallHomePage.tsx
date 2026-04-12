import { Link } from 'react-router-dom';
import { useEffect, useReducer, useState } from 'react';

import { authApi } from '@/api/auth';
import {
  PublicClubsSection,
  PublicHallError,
  PublicHallLeaderboardLoading,
  PublicHallLoading,
  PublicLeaderboardSection,
  PublicSchedulesSection,
} from '@/features/public-hall/components';
import { usePublicHallHomeData, usePublicHallLeaderboardData, usePublicHallState } from '@/features/public-hall/hooks';
import type { PublicHallState } from '@/features/public-hall/types';
import { useAuth, useRefreshNotice } from '@/hooks';
import { useAsyncResource } from '@/hooks/useAsyncResource';

export function PublicHallHomePage() {
  const { state, setState } = usePublicHallState();
  const { session } = useAuth();
  const operatorId = session?.user.operatorId ?? '';
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const { data, isLoading, error } = usePublicHallHomeData(state, { session }, reloadKey);
  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    error: leaderboardError,
  } = usePublicHallLeaderboardData(state, data, reloadKey);
  const { notifyRefreshResult } = useRefreshNotice();
  const { data: currentPlayer } = useAsyncResource(
    async () => {
      if (!session?.user.roles.isRegisteredPlayer || !operatorId) {
        return null;
      }

      return authApi.getCurrentPlayer(operatorId);
    },
    [operatorId, session?.user.roles.isRegisteredPlayer],
  );

  const handleStateChange = (patch: Partial<PublicHallState>) => {
    setState((current) => ({ ...current, ...patch }));
  };

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
          fallbackTitle: 'Public hall refreshed with fallback',
          fallbackMessage: 'Some public hall panels are currently using mock data.',
        },
        error,
      );
      setPendingRefresh(false);
      return;
    }

    if (!data) {
      return;
    }

    notifyRefreshResult(
      [data.schedules, data.clubs, ...(leaderboardData ? [leaderboardData.leaderboard] : [])],
      {
        failureTitle: 'Public hall refresh failed',
        successTitle: 'Public hall refreshed',
        successMessage: 'Live public hall data was reloaded successfully.',
        fallbackTitle: 'Public hall refreshed with fallback',
        fallbackMessage: 'Some public hall panels are currently using mock data.',
      },
      error,
    );

    setPendingRefresh(false);
  }, [data, error, isLoading, leaderboardData, notifyRefreshResult, pendingRefresh]);

  const handleRefresh = () => {
    setPendingRefresh(true);
    forceReload();
  };

  if (isLoading && !data) {
    return <PublicHallLoading />;
  }

  if (error && !data) {
    return <PublicHallError message={error} />;
  }

  if (!data) {
    return <PublicHallError message="Public hall data is unavailable." />;
  }

  let activeViewMarkup;

  if (state.activeView === 'clubs') {
    activeViewMarkup = (
      <PublicClubsSection
        payload={data.clubs}
        state={state}
        onStateChange={handleStateChange}
        onRefresh={handleRefresh}
      />
    );
  } else if (state.activeView === 'leaderboard') {
    if (isLeaderboardLoading && !leaderboardData) {
      activeViewMarkup = <PublicHallLeaderboardLoading />;
    } else if (leaderboardError && !leaderboardData) {
      activeViewMarkup = <PublicHallError message={leaderboardError} />;
    } else if (leaderboardData) {
      activeViewMarkup = (
        <PublicLeaderboardSection
          payload={leaderboardData.leaderboard}
          state={state}
          clubs={data.clubs.envelope.items}
          onStateChange={handleStateChange}
          onRefresh={handleRefresh}
        />
      );
    } else {
      activeViewMarkup = <PublicHallLeaderboardLoading />;
    }
  } else {
    activeViewMarkup = (
      <PublicSchedulesSection
        payload={data.schedules}
        state={state}
        onStateChange={handleStateChange}
        onRefresh={handleRefresh}
      />
    );
  }

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
      detail: leaderboardData ? `${leaderboardData.leaderboard.envelope.total} players` : 'Leaderboard standby',
    },
  ];

  const displayName =
    currentPlayer?.displayName ?? session?.user.displayName ?? session?.user.username ?? 'Guest Player';
  const eloText = currentPlayer?.elo ? `${currentPlayer.elo}` : 'Guest';

  return (
    <section className="public-portal public-portal--mahjong public-portal--lobby">
      <section className="public-lobby__player-card public-lobby__player-card--floating">
        <div className="public-lobby__player-copy">
          <p className="public-lobby__player-meta">
            <span>{`ELO: ${eloText}`}</span>
          </p>
          <strong className="public-lobby__player-link public-lobby__player-link--static">
            {displayName}
          </strong>
        </div>
        <Link
          to="/me"
          className="public-lobby__player-avatar"
          aria-label="进入个人主页"
          title="进入个人主页"
        >
          <span className="public-lobby__player-avatar-icon" aria-hidden="true" />
        </Link>
      </section>

      <div className="public-lobby">
        <div className="public-lobby__main">
          <div className="public-lobby__stage">
            <div className="public-lobby__stage-scroll">{activeViewMarkup}</div>
          </div>
        </div>

        <aside className="public-lobby__sidebar">
          <div className="public-lobby__menu">
            {lobbyEntries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`public-lobby__menu-button ${
                  state.activeView === entry.id ? 'public-lobby__menu-button--active' : ''
                }`}
                onClick={() => handleStateChange({ activeView: entry.id })}
              >
                <span className="public-lobby__menu-frame" aria-hidden="true" />
                <span className="public-lobby__menu-surface" aria-hidden="true" />
                <span className="public-lobby__menu-flower public-lobby__menu-flower--left" aria-hidden="true" />
                <span className="public-lobby__menu-flower public-lobby__menu-flower--right" aria-hidden="true" />
                <span className="public-lobby__menu-alert" aria-hidden="true">
                  !
                </span>
                <span className="public-lobby__menu-copy">
                  <span className="public-lobby__menu-eyebrow">{entry.label}</span>
                  <strong className="public-lobby__menu-title">{entry.heading}</strong>
                </span>
                <small className="public-lobby__menu-tag">{entry.detail}</small>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
