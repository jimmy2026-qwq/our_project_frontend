import { Link } from 'react-router-dom';

import {
  DetailHero,
  DetailPageShell,
  InfoSummaryCard,
  InfoSummaryGrid,
  PortalSection,
} from '@/components/shared/data-display';
import { Badge, LoadingProgress, Tabs, TabsList, TabsTrigger } from '@/components/ui';
import type {
  ClubSummary,
  PlayerLeaderboardEntry,
  PublicSchedule,
} from '@/domain/models';

import type { LoadState, PublicView } from '../types';

export const PublicHallLoading = () => {
  return (
    <section className="public-portal">
      <section className="portal-hero portal-hero--loading grid gap-[22px] lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
        <div className="portal-hero__main relative overflow-hidden rounded-[var(--radius-xl)] p-[38px] shadow-[var(--shadow-lg)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))]">
          <p className="portal-hero__eyebrow">Guest Lobby</p>
          <h1>Loading public hall...</h1>
          <p className="portal-hero__summary">Fetching public schedules, club cards, and leaderboard data.</p>
          <LoadingProgress
            className="mt-6 max-w-[420px]"
            label="大厅加载中"
            message="正在同步公开赛程、俱乐部目录和首页摘要。"
            indeterminate
            tone="warm"
          />
        </div>
      </section>
    </section>
  );
};

export const PublicHallError = ({ message }: { message: string }) => {
  return (
    <section className="public-portal">
      <section className="portal-hero portal-hero--loading grid gap-[22px] lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
        <div className="portal-hero__main relative overflow-hidden rounded-[var(--radius-xl)] p-[38px] shadow-[var(--shadow-lg)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))]">
          <p className="portal-hero__eyebrow">Guest Lobby</p>
          <h1>Public hall failed to render</h1>
          <p className="portal-hero__summary">{message}</p>
        </div>
      </section>
    </section>
  );
};

export const PublicHallHero = ({
  schedules,
  leaderboard,
  clubs,
  onSelectView,
}: {
  schedules: LoadState<PublicSchedule>;
  leaderboard: LoadState<PlayerLeaderboardEntry> | null;
  clubs: LoadState<ClubSummary>;
  onSelectView: (view: PublicView) => void;
}) => {
  const nextSchedule = schedules.envelope.items[0];
  const topPlayer = leaderboard?.envelope.items[0];
  const featuredClub = clubs.envelope.items[0];

  return (
    <section className="portal-hero grid gap-[22px] lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
      <div className="portal-hero__main relative overflow-hidden rounded-[var(--radius-xl)] p-[38px] shadow-[var(--shadow-lg)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))] before:pointer-events-none before:absolute before:inset-[auto_-5%_-18%_auto] before:h-[260px] before:w-[260px] before:rounded-full before:bg-[radial-gradient(circle,rgba(114,216,209,0.16),transparent_70%)] before:content-['']">
        <div className="portal-hero__badge-row flex items-center gap-[14px]">
          <p className="portal-hero__eyebrow">Guest Lobby</p>
          <Badge className="portal-inline-badge" variant={schedules.source === 'api' ? 'success' : 'warning'}>
            {schedules.source === 'api' ? 'Public API' : 'Mock'}
          </Badge>
        </div>
        <h1>Public Hall</h1>
        <p className="portal-hero__summary">
          Public hall home now loads schedules, clubs, and leaderboard data directly from lightweight public
          endpoints.
        </p>
        <InfoSummaryGrid className="portal-hero__highlights">
          <InfoSummaryCard
            className="portal-highlight"
            label="Next featured stage"
            title={nextSchedule ? nextSchedule.stageName : 'No schedule yet'}
            detail={nextSchedule ? nextSchedule.scheduledAt : 'Waiting for schedule data'}
            detailAs="small"
          />
          <InfoSummaryCard
            className="portal-highlight"
            label="Current top player"
            title={topPlayer ? topPlayer.nickname : '--'}
            detail={topPlayer ? `${topPlayer.clubName} / ELO ${topPlayer.elo}` : 'Waiting for leaderboard data'}
            detailAs="small"
          />
        </InfoSummaryGrid>
        <div className="portal-hero__quicklinks">
          <button className="portal-chip" onClick={() => onSelectView('schedules')}>
            Schedules
          </button>
          <button className="portal-chip" onClick={() => onSelectView('clubs')}>
            Clubs
          </button>
          <button className="portal-chip" onClick={() => onSelectView('leaderboard')}>
            Leaderboard
          </button>
        </div>
      </div>
      <aside className="portal-hero__aside grid gap-[22px]">
        <InfoSummaryCard
          className="portal-stat portal-stat--accent"
          label="Next public tournament"
          title={nextSchedule ? nextSchedule.tournamentName : '--'}
          detail={
            nextSchedule
              ? `${nextSchedule.stageName} / ${nextSchedule.scheduledAt}`
              : 'No upcoming schedule'
          }
          detailAs="small"
        />
        <InfoSummaryCard
          className="portal-stat"
          label="Visible clubs"
          title={clubs.envelope.total}
          detail={featuredClub ? `${featuredClub.name} / Power ${featuredClub.powerRating}` : 'Waiting for club data'}
          detailAs="small"
        />
        <InfoSummaryCard
          className="portal-stat"
          label="Default leaderboard filter"
          title="Active"
          detail="Showing active players first"
          detailAs="small"
        />
      </aside>
    </section>
  );
};

export const PublicHallOverviewStrip = ({
  schedules,
  leaderboard,
  clubs,
}: {
  schedules: LoadState<PublicSchedule>;
  leaderboard: LoadState<PlayerLeaderboardEntry> | null;
  clubs: LoadState<ClubSummary>;
}) => {
  const cards = [
    {
      title: 'Public schedules',
      value: `${schedules.envelope.total}`,
      detail: schedules.envelope.items[0]
        ? `${schedules.envelope.items[0].tournamentName} currently featured`
        : 'Waiting for schedule data',
    },
    {
      title: 'Club directory',
      value: `${clubs.envelope.total}`,
      detail: clubs.envelope.items[0]
        ? `${clubs.envelope.items[0].name} in the current public set`
        : 'Waiting for club data',
    },
    {
      title: 'Player leaderboard',
      value: leaderboard ? `${leaderboard.envelope.total}` : '--',
      detail: leaderboard?.envelope.items[0]
        ? `${leaderboard.envelope.items[0].nickname} currently leads`
        : 'Waiting for leaderboard data',
    },
  ];

  return (
    <InfoSummaryGrid className="portal-overview grid gap-[22px] md:grid-cols-3">
      {cards.map((card) => (
        <InfoSummaryCard
          key={card.title}
          className="overview-card rounded-[22px] bg-[color:var(--bg-soft)] px-[22px] py-5 [&_strong]:my-2 [&_strong]:block [&_strong]:text-[2rem] [&_strong]:text-[color:var(--text)] [&_strong]:drop-shadow-[0_4px_18px_rgba(3,8,14,0.22)]"
          label={card.title}
          title={card.value}
          detail={card.detail}
          detailAs="small"
        />
      ))}
    </InfoSummaryGrid>
  );
};

export const PublicHallLeaderboardLoading = () => {
  return (
    <PortalSection
      eyebrow="排行榜"
      title="玩家排行榜"
      description="排行榜改为按需加载，减少公共大厅首屏等待。"
      source="api"
    >
      <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[color:var(--panel)] px-6 py-7 shadow-[var(--shadow-md)]">
        <LoadingProgress
          label="排行榜加载中"
          message="正在按需请求玩家排行榜数据。"
          indeterminate
        />
      </div>
    </PortalSection>
  );
};

export const getStatusTone = (value: string): 'neutral' | 'info' | 'success' | 'warning' | 'danger' => {
  const normalized = value.toLowerCase();

  if (normalized.includes('active') || normalized.includes('approved') || normalized.includes('finished')) {
    return 'success';
  }

  if (normalized.includes('progress') || normalized.includes('registration') || normalized.includes('scoring')) {
    return 'info';
  }

  if (normalized.includes('pending') || normalized.includes('draft') || normalized.includes('open')) {
    return 'warning';
  }

  if (normalized.includes('banned') || normalized.includes('reject') || normalized.includes('appeal')) {
    return 'danger';
  }

  return 'neutral';
};

export const PublicHallTabs = ({
  activeView,
  onSelectView,
}: {
  activeView: PublicView;
  onSelectView: (view: PublicView) => void;
}) => {
  const tabs: Array<{ id: PublicView; label: string; summary: string }> = [
    { id: 'schedules', label: 'Schedules', summary: 'Browse public tournament stages and timing.' },
    { id: 'clubs', label: 'Clubs', summary: 'Browse public club cards and open profiles.' },
    { id: 'leaderboard', label: 'Leaderboard', summary: 'Check ELO ranking and player status.' },
  ];

  return (
    <Tabs value={activeView} onValueChange={(value) => onSelectView(value as PublicView)} className="portal-tabs-shell">
      <TabsList className="portal-tabs grid gap-[14px] md:grid-cols-3" aria-label="Public hall navigation">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="portal-tab cursor-pointer">
            <strong>{tab.label}</strong>
            <span>{tab.summary}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export const PublicDetailNotFound = ({ title }: { title: string }) => {
  return (
    <DetailPageShell
      backLink={
        <Link className="detail-back" to="/public">
          Back to public hall
        </Link>
      }
      hero={
        <DetailHero
          eyebrow="Not Found"
          title={title}
          summary="The requested public detail view is not available right now."
        />
      }
    />
  );
};
