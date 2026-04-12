import { InfoSummaryCard, InfoSummaryGrid } from '@/components/shared/data-display';
import { Badge } from '@/components/ui';

import type { PublicHallHeroProps, PublicHallOverviewStripProps } from './shared.types';

export const PublicHallHero = ({
  schedules,
  leaderboard,
  clubs,
  onSelectView,
}: PublicHallHeroProps) => {
  const nextSchedule = schedules.envelope.items[0];
  const topPlayer = leaderboard?.envelope.items[0];
  const featuredClub = clubs.envelope.items[0];
  const quickFacts = [
    {
      label: 'Featured Tournament',
      value: nextSchedule ? nextSchedule.tournamentName : 'Waiting for rotation',
    },
    {
      label: 'Hall Clubs',
      value: `${clubs.envelope.total} available`,
    },
    {
      label: 'Top Seed',
      value: topPlayer ? topPlayer.nickname : 'Leaderboard pending',
    },
  ];

  return (
    <section className="portal-hero grid gap-[22px] lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
      <div className="portal-hero__main relative overflow-hidden">
        <div className="portal-hero__mist" />
        <div className="portal-hero__tile-art" aria-hidden="true">
          <img src="/mahjong-soul/tiles/hand-cards.png" alt="" />
        </div>
        <div className="portal-hero__frame" aria-hidden="true" />
        <div className="portal-hero__badge-row flex items-center gap-[14px]">
          <p className="portal-hero__eyebrow">Public Hall</p>
          <Badge className="portal-inline-badge" variant={schedules.source === 'api' ? 'success' : 'warning'}>
            {schedules.source === 'api' ? 'Public API' : 'Mock'}
          </Badge>
        </div>
        <p className="portal-hero__kicker">Riichi Nexus Lobby</p>
        <h1>Step into the tournament hall.</h1>
        <p className="portal-hero__summary">
          A Mahjong Soul inspired front door for public events, club discovery, and live ladder
          tracking. The data flow stays the same, but the scene now behaves like a destination
          rather than a dashboard.
        </p>
        <div className="portal-hero__facts">
          {quickFacts.map((fact) => (
            <div key={fact.label} className="portal-hero__fact">
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
        </div>
        <InfoSummaryGrid className="portal-hero__highlights">
          <InfoSummaryCard
            className="portal-highlight"
            label="Next Featured Stage"
            title={nextSchedule ? nextSchedule.stageName : 'No schedule yet'}
            detail={nextSchedule ? nextSchedule.scheduledAt : 'Waiting for schedule data'}
            detailAs="small"
          />
          <InfoSummaryCard
            className="portal-highlight"
            label="Current Top Player"
            title={topPlayer ? topPlayer.nickname : '--'}
            detail={topPlayer ? `${topPlayer.clubName} / ELO ${topPlayer.elo}` : 'Waiting for leaderboard data'}
            detailAs="small"
          />
        </InfoSummaryGrid>
        <div className="portal-hero__quicklinks">
          <button className="portal-chip portal-chip--schedules" onClick={() => onSelectView('schedules')}>
            Enter schedules
          </button>
          <button className="portal-chip portal-chip--clubs" onClick={() => onSelectView('clubs')}>
            Explore clubs
          </button>
          <button className="portal-chip portal-chip--leaderboard" onClick={() => onSelectView('leaderboard')}>
            View ladder
          </button>
        </div>
      </div>
      <aside className="portal-hero__aside grid gap-[22px]">
        <InfoSummaryCard
          className="portal-stat portal-stat--accent"
          label="Featured Tournament"
          title={nextSchedule ? nextSchedule.tournamentName : '--'}
          detail={nextSchedule ? `${nextSchedule.stageName} / ${nextSchedule.scheduledAt}` : 'No upcoming schedule'}
          detailAs="small"
        />
        <InfoSummaryCard
          className="portal-stat"
          label="Visible Clubs"
          title={clubs.envelope.total}
          detail={featuredClub ? `${featuredClub.name} / Power ${featuredClub.powerRating}` : 'Waiting for club data'}
          detailAs="small"
        />
        <InfoSummaryCard
          className="portal-stat"
          label="Leaderboard Mode"
          title="Active"
          detail="Ladder view opens with active competitors first."
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
}: PublicHallOverviewStripProps) => {
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
          className="overview-card [&_strong]:my-2 [&_strong]:block [&_strong]:text-[2rem] [&_strong]:text-[color:var(--text)]"
          label={card.title}
          title={card.value}
          detail={card.detail}
          detailAs="small"
        />
      ))}
    </InfoSummaryGrid>
  );
};
