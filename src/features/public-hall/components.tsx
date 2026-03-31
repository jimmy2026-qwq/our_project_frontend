import { Link } from 'react-router-dom';

import { DetailCard, DetailHero, DetailList, DetailListItem, DetailRow, DetailRows, PortalSection } from '@/components/shared/data-display';
import { EmptyState } from '@/components/shared/feedback';
import { CheckboxField, SelectField } from '@/components/shared/forms';
import { ActionButton, PortalFilters } from '@/components/shared/layout';
import type {
  ClubPublicProfile,
  ClubSummary,
  PlayerLeaderboardEntry,
  PublicSchedule,
  TournamentPublicProfile,
} from '@/domain/models';
import { mockClubProfiles } from '@/mocks/overview';

import type { DetailState, LoadState, PublicHallState, PublicView } from './types';
import {
  formatDateTime,
  formatNumber,
  getLeaderboardStatusLabel,
  getRelationLabel,
  getStageStatusLabel,
  getTournamentStatusLabel,
} from './utils';

export function PublicHallLoading() {
  return (
    <section className="public-portal">
      <section className="portal-hero portal-hero--loading">
        <div className="portal-hero__main">
          <p className="portal-hero__eyebrow">Guest Lobby</p>
          <h1>Loading public hall...</h1>
          <p className="portal-hero__summary">Fetching public schedules, club cards, and leaderboard data.</p>
        </div>
      </section>
    </section>
  );
}

export function PublicHallError({ message }: { message: string }) {
  return (
    <section className="public-portal">
      <section className="portal-hero portal-hero--loading">
        <div className="portal-hero__main">
          <p className="portal-hero__eyebrow">Guest Lobby</p>
          <h1>Public hall failed to render</h1>
          <p className="portal-hero__summary">{message}</p>
        </div>
      </section>
    </section>
  );
}

export function PublicHallHero({
  schedules,
  leaderboard,
  clubs,
  onSelectView,
}: {
  schedules: LoadState<PublicSchedule>;
  leaderboard: LoadState<PlayerLeaderboardEntry>;
  clubs: LoadState<ClubSummary>;
  onSelectView: (view: PublicView) => void;
}) {
  const nextSchedule = schedules.envelope.items[0];
  const topPlayer = leaderboard.envelope.items[0];
  const featuredClub = clubs.envelope.items[0];

  return (
    <section className="portal-hero">
      <div className="portal-hero__main">
        <div className="portal-hero__badge-row">
          <p className="portal-hero__eyebrow">Guest Lobby</p>
          <span className="portal-inline-badge">{schedules.source === 'api' ? 'Public API' : 'Mock'}</span>
        </div>
        <h1>Public Hall</h1>
        <p className="portal-hero__summary">
          Public hall home now loads schedules, clubs, and leaderboard data directly from lightweight public
          endpoints.
        </p>
        <div className="portal-hero__highlights">
          <article className="portal-highlight">
            <span>Next featured stage</span>
            <strong>{nextSchedule ? nextSchedule.stageName : 'No schedule yet'}</strong>
            <small>{nextSchedule ? formatDateTime(nextSchedule.scheduledAt) : 'Waiting for schedule data'}</small>
          </article>
          <article className="portal-highlight">
            <span>Current top player</span>
            <strong>{topPlayer ? topPlayer.nickname : '--'}</strong>
            <small>{topPlayer ? `${topPlayer.clubName} / ELO ${topPlayer.elo}` : 'Waiting for leaderboard data'}</small>
          </article>
        </div>
        <div className="portal-hero__quicklinks">
          <button type="button" className="portal-chip" onClick={() => onSelectView('schedules')}>
            Schedules
          </button>
          <button type="button" className="portal-chip" onClick={() => onSelectView('clubs')}>
            Clubs
          </button>
          <button type="button" className="portal-chip" onClick={() => onSelectView('leaderboard')}>
            Leaderboard
          </button>
        </div>
      </div>
      <aside className="portal-hero__aside">
        <article className="portal-stat portal-stat--accent">
          <span>Next public tournament</span>
          <strong>{nextSchedule ? nextSchedule.tournamentName : '--'}</strong>
          <small>
            {nextSchedule
              ? `${nextSchedule.stageName} / ${formatDateTime(nextSchedule.scheduledAt)}`
              : 'No upcoming schedule'}
          </small>
        </article>
        <article className="portal-stat">
          <span>Visible clubs</span>
          <strong>{clubs.envelope.total}</strong>
          <small>{featuredClub ? `${featuredClub.name} / Power ${featuredClub.powerRating}` : 'Waiting for club data'}</small>
        </article>
        <article className="portal-stat">
          <span>Default leaderboard filter</span>
          <strong>{getLeaderboardStatusLabel('Active')}</strong>
          <small>Showing active players first</small>
        </article>
      </aside>
    </section>
  );
}

export function PublicHallOverviewStrip({
  schedules,
  leaderboard,
  clubs,
}: {
  schedules: LoadState<PublicSchedule>;
  leaderboard: LoadState<PlayerLeaderboardEntry>;
  clubs: LoadState<ClubSummary>;
}) {
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
      value: `${leaderboard.envelope.total}`,
      detail: leaderboard.envelope.items[0]
        ? `${leaderboard.envelope.items[0].nickname} currently leads`
        : 'Waiting for leaderboard data',
    },
  ];

  return (
    <section className="portal-overview">
      {cards.map((card) => (
        <article key={card.title} className="overview-card">
          <span>{card.title}</span>
          <strong>{card.value}</strong>
          <small>{card.detail}</small>
        </article>
      ))}
    </section>
  );
}

export function PublicHallTabs({
  activeView,
  onSelectView,
}: {
  activeView: PublicView;
  onSelectView: (view: PublicView) => void;
}) {
  const tabs: Array<{ id: PublicView; label: string; summary: string }> = [
    { id: 'schedules', label: 'Schedules', summary: 'Browse public tournament stages and timing.' },
    { id: 'clubs', label: 'Clubs', summary: 'Browse public club cards and open profiles.' },
    { id: 'leaderboard', label: 'Leaderboard', summary: 'Check ELO ranking and player status.' },
  ];

  return (
    <nav className="portal-tabs" aria-label="Public hall navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`portal-tab ${tab.id === activeView ? 'portal-tab--active' : ''}`}
          onClick={() => onSelectView(tab.id)}
        >
          <strong>{tab.label}</strong>
          <span>{tab.summary}</span>
        </button>
      ))}
    </nav>
  );
}

export function PublicSchedulesSection({
  payload,
  state,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<PublicSchedule>;
  state: PublicHallState;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) {
  return (
    <PortalSection
      eyebrow="Schedules"
      title="Public Schedules"
      description="Loaded from GET /public/schedules and filtered locally in the page state."
      source={payload.source}
      warning={payload.warning}
    >
      <PortalFilters>
        <SelectField
          label="Tournament status"
          value={state.scheduleTournamentStatus}
          onChange={(event) =>
            onStateChange({
              scheduleTournamentStatus: event.currentTarget.value as PublicHallState['scheduleTournamentStatus'],
            })
          }
        >
            <option value="">All</option>
            <option value="Draft">Draft</option>
            <option value="Registration">Registration</option>
            <option value="InProgress">In progress</option>
            <option value="Finished">Finished</option>
        </SelectField>
        <SelectField
          label="Stage status"
          value={state.scheduleStageStatus}
          onChange={(event) =>
            onStateChange({
              scheduleStageStatus: event.currentTarget.value as PublicHallState['scheduleStageStatus'],
            })
          }
        >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
        </SelectField>
        <ActionButton onClick={onRefresh}>
          Refresh
        </ActionButton>
      </PortalFilters>
      <div className="schedule-grid">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((item) => (
            <article key={`${item.tournamentId}-${item.stageId}`} className="schedule-card">
              <div className="schedule-card__top">
                <span className="schedule-card__status">{getTournamentStatusLabel(item.tournamentStatus)}</span>
                <span className="schedule-card__minor">{getStageStatusLabel(item.stageStatus)}</span>
              </div>
              <h3>{item.tournamentName}</h3>
              <p>{item.stageName}</p>
              <dl className="schedule-card__meta">
                <div>
                  <dt>Starts</dt>
                  <dd>{formatDateTime(item.scheduledAt)}</dd>
                </div>
                <div>
                  <dt>Tournament id</dt>
                  <dd>{item.tournamentId}</dd>
                </div>
              </dl>
              <Link className="detail-link" to={`/public/tournaments/${item.tournamentId}`}>
                Open tournament detail
              </Link>
            </article>
          ))
        ) : (
          <EmptyState>No public schedules match the current filters.</EmptyState>
        )}
      </div>
    </PortalSection>
  );
}

export function PublicClubsSection({
  payload,
  state,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<ClubSummary>;
  state: PublicHallState;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) {
  return (
    <PortalSection
      eyebrow="Clubs"
      title="Club Directory"
      description="Loaded from GET /public/clubs and adapted into the frontend club-card model."
      source={payload.source}
      warning={payload.warning}
    >
      <PortalFilters>
        <CheckboxField
          label="Prefer active clubs only"
          checked={state.clubActiveOnly}
          onChange={(event) => onStateChange({ clubActiveOnly: event.currentTarget.checked })}
        />
        <ActionButton onClick={onRefresh}>
          Refresh
        </ActionButton>
      </PortalFilters>
      <div className="club-grid">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((club) => (
            <article key={club.id} className="club-card">
              <div className="club-card__top">
                <div>
                  <h3>{club.name}</h3>
                  <p className="club-card__subtitle">{club.memberCount} members</p>
                </div>
                <span className="club-card__power">Power {club.powerRating}</span>
              </div>
              <p>Public club cards expose high-level profile, treasury, and relation summary only.</p>
              <div className="club-card__stats">
                <div>
                  <span>Treasury</span>
                  <strong>{formatNumber(club.treasury)}</strong>
                </div>
                <div>
                  <span>Relations</span>
                  <strong>{club.relations.map(getRelationLabel).join(' / ') || '--'}</strong>
                </div>
              </div>
              <Link className="detail-link" to={`/public/clubs/${club.id}`}>
                Open club detail
              </Link>
            </article>
          ))
        ) : (
          <EmptyState>No public clubs are available right now.</EmptyState>
        )}
      </div>
    </PortalSection>
  );
}

export function PublicLeaderboardSection({
  payload,
  state,
  clubs,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<PlayerLeaderboardEntry>;
  state: PublicHallState;
  clubs: ClubSummary[];
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) {
  return (
    <PortalSection
      eyebrow="Leaderboard"
      title="Player Leaderboard"
      description="Loaded from GET /public/leaderboards/players and joined with club names in the API client."
      source={payload.source}
      warning={payload.warning}
    >
      <PortalFilters>
        <SelectField
          label="Club"
          value={state.leaderboardClubId}
          onChange={(event) => onStateChange({ leaderboardClubId: event.currentTarget.value })}
        >
            <option value="">All clubs</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
        </SelectField>
        <SelectField
          label="Status"
          value={state.leaderboardStatus}
          onChange={(event) =>
            onStateChange({ leaderboardStatus: event.currentTarget.value as PublicHallState['leaderboardStatus'] })
          }
        >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Banned">Banned</option>
        </SelectField>
        <ActionButton onClick={onRefresh}>
          Refresh
        </ActionButton>
      </PortalFilters>
      <ol className="leaderboard-list">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((item, index) => {
            const club = mockClubProfiles.find((profile) => profile.name === item.clubName);

            return (
              <li key={item.playerId} className="leaderboard-row">
                <div className="leaderboard-row__rank">{item.rank || index + 1}</div>
                <div className="leaderboard-row__main">
                  <strong>{item.nickname}</strong>
                  <span>{item.clubName || '--'}</span>
                  {club ? (
                    <Link className="leaderboard-row__link" to={`/public/clubs/${club.id}`}>
                      Open club
                    </Link>
                  ) : null}
                </div>
                <div className="leaderboard-row__side">
                  <strong>ELO {item.elo}</strong>
                  <span>{getLeaderboardStatusLabel(item.status)}</span>
                </div>
              </li>
            );
          })
        ) : (
          <EmptyState>No leaderboard rows match the current filters.</EmptyState>
        )}
      </ol>
    </PortalSection>
  );
}

export function PublicTournamentDetailSection({
  state,
  stages,
}: {
  state: DetailState<TournamentPublicProfile>;
  stages: NonNullable<TournamentPublicProfile['stages']>;
}) {
  if (!state.item) {
    return <PublicDetailNotFound title="Tournament not found" />;
  }

  const profile = state.item;

  return (
    <section className="detail-page">
      <Link className="detail-back" to="/public">
        Back to public hall
      </Link>
      <DetailHero
        eyebrow="Tournament"
        title={profile.name}
        tagline={profile.tagline}
        summary={profile.description}
        source={state.source}
        warning={state.warning}
      />
      <section className="detail-grid">
        <DetailCard title="Public tournament info">
          <DetailList>
            <DetailListItem label="Status" value={getTournamentStatusLabel(profile.status)} />
            <DetailListItem label="Organizer" value={profile.venue} />
            <DetailListItem label="Stage count" value={profile.stageCount} />
            <DetailListItem label="Whitelist type" value={profile.whitelistType} />
            <DetailListItem label="Next stage" value={profile.nextStageName} />
            <DetailListItem label="Start time" value={formatDateTime(profile.nextScheduledAt)} />
          </DetailList>
        </DetailCard>
        <DetailCard title="Stage overview">
          <DetailRows>
            {stages.map((stage) => (
              <DetailRow
                key={stage.stageId}
                title={stage.name}
                detail={
                  <>
                  {getStageStatusLabel(stage.status)} / {stage.tableCount} tables / {stage.roundCount} rounds
                  </>
                }
              />
            ))}
          </DetailRows>
        </DetailCard>
      </section>
    </section>
  );
}

export function PublicClubDetailSection({ state }: { state: DetailState<ClubPublicProfile> }) {
  if (!state.item) {
    return <PublicDetailNotFound title="Club not found" />;
  }

  const profile = state.item;

  return (
    <section className="detail-page">
      <Link className="detail-back" to="/public">
        Back to public hall
      </Link>
      <DetailHero
        eyebrow="Club"
        title={profile.name}
        tagline={profile.slogan}
        summary={profile.description}
        source={state.source}
        warning={state.warning}
      />
      <section className="detail-grid">
        <DetailCard title="Public club info">
          <DetailList>
            <DetailListItem label="Members" value={profile.memberCount} />
            <DetailListItem label="Power" value={profile.powerRating} />
            <DetailListItem label="Treasury" value={formatNumber(profile.treasury)} />
            <DetailListItem label="Relations" value={profile.relations.map(getRelationLabel).join(' / ') || '--'} />
            <DetailListItem label="Featured players" value={profile.featuredPlayers.join(' / ') || '--'} />
          </DetailList>
        </DetailCard>
        <DetailCard title="Recent tournaments">
          <DetailRows>
            {profile.activeTournaments.length > 0 ? (
              profile.activeTournaments.map((item) => (
                <DetailRow key={item} title={item} detail="Visible from the public club profile endpoint." />
              ))
            ) : (
              <EmptyState asListItem>No recent tournament entries were returned.</EmptyState>
            )}
          </DetailRows>
        </DetailCard>
      </section>
    </section>
  );
}

export function PublicDetailNotFound({ title }: { title: string }) {
  return (
    <section className="detail-page">
      <Link className="detail-back" to="/public">
        Back to public hall
      </Link>
      <DetailHero
        eyebrow="Not Found"
        title={title}
        summary="The requested public detail view is not available right now."
      />
    </section>
  );
}
