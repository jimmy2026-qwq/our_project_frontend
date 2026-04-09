import { Link } from 'react-router-dom';

import { DetailHero, DetailPageShell, PortalSection } from '@/components/shared/data-display';
import { LoadingProgress } from '@/components/ui';

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
            label="Public hall loading"
            message="Syncing public schedules, club directory, and the homepage summary."
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

export const PublicHallLeaderboardLoading = () => {
  return (
    <PortalSection
      eyebrow="Leaderboard"
      title="Player Leaderboard"
      description="The leaderboard now loads on demand so the public hall can render faster."
      source="api"
    >
      <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[color:var(--panel)] px-6 py-7 shadow-[var(--shadow-md)]">
        <LoadingProgress
          label="Loading leaderboard"
          message="Fetching the latest player ranking data."
          indeterminate
        />
      </div>
    </PortalSection>
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
