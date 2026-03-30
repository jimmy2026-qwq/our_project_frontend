import { apiClient, type RawPlayerLeaderboardEntry } from '../api/client';
import type {
  ClubPublicProfile,
  ClubSummary,
  ListEnvelope,
  PlayerLeaderboardEntry,
  PublicSchedule,
  StageStatus,
  TournamentPublicProfile,
  TournamentStatus,
} from '../domain/models';
import {
  mockClubProfiles,
  mockClubs,
  mockLeaderboard,
  mockSchedules,
  mockTournamentProfiles,
  toMockEnvelope,
} from '../mocks/overview';

type DataSource = 'api' | 'mock';
type PublicView = 'schedules' | 'clubs' | 'leaderboard';
type PublicRoute =
  | { page: 'home' }
  | { page: 'tournament'; tournamentId: string }
  | { page: 'club'; clubId: string };

interface LoadState<T> {
  envelope: ListEnvelope<T>;
  source: DataSource;
  warning?: string;
}

interface DetailState<T> {
  item: T | null;
  source: DataSource;
  warning?: string;
}

interface HomeDataPayload {
  schedules: LoadState<PublicSchedule>;
  leaderboard: LoadState<PlayerLeaderboardEntry>;
  clubs: LoadState<ClubSummary>;
}

interface PublicHallState {
  activeView: PublicView;
  scheduleTournamentStatus: TournamentStatus | '';
  scheduleStageStatus: StageStatus | '';
  leaderboardClubId: string;
  leaderboardStatus: 'Active' | 'Inactive' | 'Banned' | '';
  clubActiveOnly: boolean;
}

const DEFAULT_STATE: PublicHallState = {
  activeView: 'schedules',
  scheduleTournamentStatus: 'InProgress',
  scheduleStageStatus: 'Active',
  leaderboardClubId: '',
  leaderboardStatus: 'Active',
  clubActiveOnly: true,
};

function getRoute(): PublicRoute {
  const hash = window.location.hash.replace(/^#/, '');
  const segments = hash.split('/').filter(Boolean);
  const scopedSegments = segments[0] === 'public' ? segments.slice(1) : segments;

  if (scopedSegments[0] === 'tournaments' && scopedSegments[1]) {
    return { page: 'tournament', tournamentId: scopedSegments[1] };
  }

  if (scopedSegments[0] === 'clubs' && scopedSegments[1]) {
    return { page: 'club', clubId: scopedSegments[1] };
  }

  return { page: 'home' };
}

function createSourceBadge(source: DataSource, warning?: string) {
  return `
    <div class="public-hall__meta">
      <span class="source-badge source-badge--${source}">${source === 'api' ? 'API' : 'Mock'}</span>
      ${warning ? `<p class="public-hall__warning">${warning}</p>` : ''}
    </div>
  `;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value);
}

function tournamentHref(tournamentId: string) {
  return `#/public/tournaments/${tournamentId}`;
}

function clubHref(clubId: string) {
  return `#/public/clubs/${clubId}`;
}

function getTournamentStatusLabel(status: TournamentStatus | '') {
  return (
    {
      '': 'All tournaments',
      Draft: 'Draft',
      Registration: 'Registration',
      InProgress: 'In progress',
      Finished: 'Finished',
    } as const
  )[status];
}

function getStageStatusLabel(status: StageStatus | '') {
  return (
    {
      '': 'All stages',
      Pending: 'Pending',
      Active: 'Active',
      Completed: 'Completed',
    } as const
  )[status];
}

function getRelationLabel(relation: ClubSummary['relations'][number]) {
  return relation === 'Alliance' ? 'Alliance' : 'Hostile';
}

function getLeaderboardStatusLabel(status: PublicHallState['leaderboardStatus']) {
  return (
    {
      '': 'All players',
      Active: 'Active',
      Inactive: 'Inactive',
      Banned: 'Banned',
    } as const
  )[status];
}

function mapLeaderboardStatus(status: RawPlayerLeaderboardEntry['status']): PlayerLeaderboardEntry['status'] {
  return status === 'Suspended' ? 'Inactive' : status;
}

function formatRankLabel(rank?: RawPlayerLeaderboardEntry['currentRank']) {
  if (!rank) {
    return null;
  }

  return rank.stars ? `${rank.platform} ${rank.tier} ${rank.stars}` : `${rank.platform} ${rank.tier}`;
}

async function loadSchedules(state: PublicHallState): Promise<LoadState<PublicSchedule>> {
  try {
    const envelope = await apiClient.getPublicSchedules({
      tournamentStatus: state.scheduleTournamentStatus || undefined,
      stageStatus: state.scheduleStageStatus || undefined,
    });
    return { envelope, source: 'api' };
  } catch (error) {
    const items = mockSchedules.filter((item) => {
      const tournamentMatch =
        !state.scheduleTournamentStatus || item.tournamentStatus === state.scheduleTournamentStatus;
      const stageMatch = !state.scheduleStageStatus || item.stageStatus === state.scheduleStageStatus;
      return tournamentMatch && stageMatch;
    });

    return {
      envelope: toMockEnvelope(items, {
        tournamentStatus: state.scheduleTournamentStatus,
        stageStatus: state.scheduleStageStatus,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Public schedules fallback to mock.',
    };
  }
}

async function loadClubs(state: PublicHallState): Promise<LoadState<ClubSummary>> {
  try {
    const envelope = await apiClient.getPublicClubs();
    return { envelope, source: 'api' };
  } catch (error) {
    return {
      envelope: toMockEnvelope(mockClubs, { activeOnly: state.clubActiveOnly }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club directory fallback to mock.',
    };
  }
}

async function loadLeaderboard(
  state: PublicHallState,
  clubs: LoadState<ClubSummary>,
): Promise<LoadState<PlayerLeaderboardEntry>> {
  try {
    const envelope = await apiClient.getPublicPlayerLeaderboard({
      clubId: state.leaderboardClubId || undefined,
      status: state.leaderboardStatus || undefined,
    });

    const clubNamesById = new Map(clubs.envelope.items.map((club) => [club.id, club.name]));
    return {
      envelope: {
        ...envelope,
        items: envelope.items.map((item, index) => ({
          playerId: item.playerId,
          nickname: item.nickname,
          clubName: item.clubIds.map((clubId) => clubNamesById.get(clubId) ?? clubId).join(' / '),
          elo: item.elo,
          rank: index + 1 + envelope.offset,
          currentRank: formatRankLabel(item.currentRank),
          normalizedRankScore: item.normalizedRankScore,
          status: mapLeaderboardStatus(item.status),
        })),
      },
      source: 'api',
    };
  } catch (error) {
    const selectedClubName = mockClubs.find((club) => club.id === state.leaderboardClubId)?.name;
    const items = mockLeaderboard.filter((item) => {
      const clubMatch = !selectedClubName || item.clubName === selectedClubName;
      const statusMatch = !state.leaderboardStatus || item.status === state.leaderboardStatus;
      return clubMatch && statusMatch;
    });

    return {
      envelope: toMockEnvelope(items, {
        clubId: state.leaderboardClubId,
        status: state.leaderboardStatus,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Player leaderboard fallback to mock.',
    };
  }
}

async function loadHomeData(state: PublicHallState): Promise<HomeDataPayload> {
  const [schedules, clubs] = await Promise.all([loadSchedules(state), loadClubs(state)]);
  const leaderboard = await loadLeaderboard(state, clubs);
  return { schedules, leaderboard, clubs };
}

async function loadTournamentDetail(tournamentId: string): Promise<DetailState<TournamentPublicProfile>> {
  try {
    const item = await apiClient.getPublicTournamentProfile(tournamentId);
    return { item, source: 'api' };
  } catch (error) {
    return {
      item: mockTournamentProfiles.find((profile) => profile.id === tournamentId) ?? null,
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Tournament detail fallback to mock.',
    };
  }
}

async function loadClubDetail(clubId: string): Promise<DetailState<ClubPublicProfile>> {
  try {
    const item = await apiClient.getPublicClubProfile(clubId);
    return { item, source: 'api' };
  } catch (error) {
    const fallbackClub = mockClubs.find((club) => club.id === clubId);
    return {
      item:
        mockClubProfiles.find((profile) => profile.id === clubId) ??
        (fallbackClub
          ? {
              id: fallbackClub.id,
              name: fallbackClub.name,
              slogan: 'Public club profile',
              description:
                'Club detail fell back to the directory payload because the full public detail response was unavailable.',
              memberCount: fallbackClub.memberCount,
              powerRating: fallbackClub.powerRating,
              treasury: fallbackClub.treasury,
              relations: fallbackClub.relations,
              featuredPlayers: [],
              activeTournaments: [],
            }
          : null),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club detail fallback to mock.',
    };
  }
}

function renderPortalHero(
  schedules: LoadState<PublicSchedule>,
  leaderboard: LoadState<PlayerLeaderboardEntry>,
  clubs: LoadState<ClubSummary>,
) {
  const nextSchedule = schedules.envelope.items[0];
  const topPlayer = leaderboard.envelope.items[0];
  const featuredClub = clubs.envelope.items[0];

  return `
    <section class="portal-hero">
      <div class="portal-hero__main">
        <div class="portal-hero__badge-row">
          <p class="portal-hero__eyebrow">Guest Lobby</p>
          <span class="portal-inline-badge">${schedules.source === 'api' ? 'Public API' : 'Mock'}</span>
        </div>
        <h1>Public Hall</h1>
        <p class="portal-hero__summary">
          Public hall home now loads schedules, clubs, and leaderboard data directly from lightweight public endpoints.
        </p>
        <div class="portal-hero__highlights">
          <article class="portal-highlight">
            <span>Next featured stage</span>
            <strong>${nextSchedule ? nextSchedule.stageName : 'No schedule yet'}</strong>
            <small>${nextSchedule ? formatDateTime(nextSchedule.scheduledAt) : 'Waiting for schedule data'}</small>
          </article>
          <article class="portal-highlight">
            <span>Current top player</span>
            <strong>${topPlayer ? topPlayer.nickname : '--'}</strong>
            <small>${topPlayer ? `${topPlayer.clubName} / ELO ${topPlayer.elo}` : 'Waiting for leaderboard data'}</small>
          </article>
        </div>
        <div class="portal-hero__quicklinks">
          <button type="button" class="portal-chip" data-view="schedules">Schedules</button>
          <button type="button" class="portal-chip" data-view="clubs">Clubs</button>
          <button type="button" class="portal-chip" data-view="leaderboard">Leaderboard</button>
        </div>
      </div>
      <aside class="portal-hero__aside">
        <article class="portal-stat portal-stat--accent">
          <span>Next public tournament</span>
          <strong>${nextSchedule ? nextSchedule.tournamentName : '--'}</strong>
          <small>${nextSchedule ? `${nextSchedule.stageName} / ${formatDateTime(nextSchedule.scheduledAt)}` : 'No upcoming schedule'}</small>
        </article>
        <article class="portal-stat">
          <span>Visible clubs</span>
          <strong>${clubs.envelope.total}</strong>
          <small>${featuredClub ? `${featuredClub.name} / Power ${featuredClub.powerRating}` : 'Waiting for club data'}</small>
        </article>
        <article class="portal-stat">
          <span>Default leaderboard filter</span>
          <strong>${getLeaderboardStatusLabel('Active')}</strong>
          <small>Showing active players first</small>
        </article>
      </aside>
    </section>
  `;
}

function renderOverviewStrip(
  schedules: LoadState<PublicSchedule>,
  leaderboard: LoadState<PlayerLeaderboardEntry>,
  clubs: LoadState<ClubSummary>,
) {
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

  return `
    <section class="portal-overview">
      ${cards
        .map(
          (card) => `
            <article class="overview-card">
              <span>${card.title}</span>
              <strong>${card.value}</strong>
              <small>${card.detail}</small>
            </article>
          `,
        )
        .join('')}
    </section>
  `;
}

function renderSectionTabs(activeView: PublicView) {
  const tabs: Array<{ id: PublicView; label: string; summary: string }> = [
    { id: 'schedules', label: 'Schedules', summary: 'Browse public tournament stages and timing.' },
    { id: 'clubs', label: 'Clubs', summary: 'Browse public club cards and open profiles.' },
    { id: 'leaderboard', label: 'Leaderboard', summary: 'Check ELO ranking and player status.' },
  ];

  return `
    <nav class="portal-tabs" aria-label="Public hall navigation">
      ${tabs
        .map(
          (tab) => `
            <button
              type="button"
              class="portal-tab ${tab.id === activeView ? 'portal-tab--active' : ''}"
              data-view="${tab.id}"
            >
              <strong>${tab.label}</strong>
              <span>${tab.summary}</span>
            </button>
          `,
        )
        .join('')}
    </nav>
  `;
}

function renderSchedulesView(payload: LoadState<PublicSchedule>, state: PublicHallState) {
  const items =
    payload.envelope.items.length > 0
      ? payload.envelope.items
          .map(
            (item) => `
              <article class="schedule-card">
                <div class="schedule-card__top">
                  <span class="schedule-card__status">${getTournamentStatusLabel(item.tournamentStatus)}</span>
                  <span class="schedule-card__minor">${getStageStatusLabel(item.stageStatus)}</span>
                </div>
                <h3>${item.tournamentName}</h3>
                <p>${item.stageName}</p>
                <dl class="schedule-card__meta">
                  <div>
                    <dt>Starts</dt>
                    <dd>${formatDateTime(item.scheduledAt)}</dd>
                  </div>
                  <div>
                    <dt>Tournament id</dt>
                    <dd>${item.tournamentId}</dd>
                  </div>
                </dl>
                <a class="detail-link" href="${tournamentHref(item.tournamentId)}">Open tournament detail</a>
              </article>
            `,
          )
          .join('')
      : '<p class="public-hall__empty">No public schedules match the current filters.</p>';

  return `
    <section class="portal-section">
      <div class="portal-section__head">
        <div>
          <p class="eyebrow">Schedules</p>
          <h2>Public Schedules</h2>
          <p>Loaded from GET /public/schedules and filtered locally in the page state.</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <div class="portal-filters">
        <label>
          <span>Tournament status</span>
          <select data-filter="schedule-tournament-status">
            <option value="" ${state.scheduleTournamentStatus === '' ? 'selected' : ''}>All</option>
            <option value="Draft" ${state.scheduleTournamentStatus === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Registration" ${state.scheduleTournamentStatus === 'Registration' ? 'selected' : ''}>Registration</option>
            <option value="InProgress" ${state.scheduleTournamentStatus === 'InProgress' ? 'selected' : ''}>In progress</option>
            <option value="Finished" ${state.scheduleTournamentStatus === 'Finished' ? 'selected' : ''}>Finished</option>
          </select>
        </label>
        <label>
          <span>Stage status</span>
          <select data-filter="schedule-stage-status">
            <option value="" ${state.scheduleStageStatus === '' ? 'selected' : ''}>All</option>
            <option value="Pending" ${state.scheduleStageStatus === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Active" ${state.scheduleStageStatus === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Completed" ${state.scheduleStageStatus === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </label>
        <button type="button" class="portal-refresh" data-action="reload-public-hall">Refresh</button>
      </div>
      <div class="schedule-grid">${items}</div>
    </section>
  `;
}

function renderClubsView(payload: LoadState<ClubSummary>, state: PublicHallState) {
  const cards =
    payload.envelope.items.length > 0
      ? payload.envelope.items
          .map(
            (club) => `
              <article class="club-card">
                <div class="club-card__top">
                  <div>
                    <h3>${club.name}</h3>
                    <p class="club-card__subtitle">${club.memberCount} members</p>
                  </div>
                  <span class="club-card__power">Power ${club.powerRating}</span>
                </div>
                <p>Public club cards expose high-level profile, treasury, and relation summary only.</p>
                <div class="club-card__stats">
                  <div>
                    <span>Treasury</span>
                    <strong>${formatNumber(club.treasury)}</strong>
                  </div>
                  <div>
                    <span>Relations</span>
                    <strong>${club.relations.map(getRelationLabel).join(' / ') || '--'}</strong>
                  </div>
                </div>
                <a class="detail-link" href="${clubHref(club.id)}">Open club detail</a>
              </article>
            `,
          )
          .join('')
      : '<p class="public-hall__empty">No public clubs are available right now.</p>';

  return `
    <section class="portal-section">
      <div class="portal-section__head">
        <div>
          <p class="eyebrow">Clubs</p>
          <h2>Club Directory</h2>
          <p>Loaded from GET /public/clubs and adapted into the frontend club-card model.</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <div class="portal-filters">
        <label class="portal-checkbox">
          <input type="checkbox" data-filter="club-active-only" ${state.clubActiveOnly ? 'checked' : ''} />
          <span>Prefer active clubs only</span>
        </label>
        <button type="button" class="portal-refresh" data-action="reload-public-hall">Refresh</button>
      </div>
      <div class="club-grid">${cards}</div>
    </section>
  `;
}

function renderLeaderboardView(
  payload: LoadState<PlayerLeaderboardEntry>,
  state: PublicHallState,
  clubs: ClubSummary[],
) {
  const clubOptions = [
    '<option value="">All clubs</option>',
    ...clubs.map(
      (club) =>
        `<option value="${club.id}" ${club.id === state.leaderboardClubId ? 'selected' : ''}>${club.name}</option>`,
    ),
  ].join('');

  const rows =
    payload.envelope.items.length > 0
      ? payload.envelope.items
          .map((item, index) => {
            const club = mockClubProfiles.find((profile) => profile.name === item.clubName);
            const clubLink = club ? `<a class="leaderboard-row__link" href="${clubHref(club.id)}">Open club</a>` : '';

            return `
              <li class="leaderboard-row">
                <div class="leaderboard-row__rank">${item.rank || index + 1}</div>
                <div class="leaderboard-row__main">
                  <strong>${item.nickname}</strong>
                  <span>${item.clubName || '--'}</span>
                  ${clubLink}
                </div>
                <div class="leaderboard-row__side">
                  <strong>ELO ${item.elo}</strong>
                  <span>${getLeaderboardStatusLabel(item.status)}</span>
                </div>
              </li>
            `;
          })
          .join('')
      : '<p class="public-hall__empty">No leaderboard rows match the current filters.</p>';

  return `
    <section class="portal-section">
      <div class="portal-section__head">
        <div>
          <p class="eyebrow">Leaderboard</p>
          <h2>Player Leaderboard</h2>
          <p>Loaded from GET /public/leaderboards/players and joined with club names in the API client.</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <div class="portal-filters">
        <label>
          <span>Club</span>
          <select data-filter="leaderboard-club">${clubOptions}</select>
        </label>
        <label>
          <span>Status</span>
          <select data-filter="leaderboard-status">
            <option value="" ${state.leaderboardStatus === '' ? 'selected' : ''}>All</option>
            <option value="Active" ${state.leaderboardStatus === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${state.leaderboardStatus === 'Inactive' ? 'selected' : ''}>Inactive</option>
            <option value="Banned" ${state.leaderboardStatus === 'Banned' ? 'selected' : ''}>Banned</option>
          </select>
        </label>
        <button type="button" class="portal-refresh" data-action="reload-public-hall">Refresh</button>
      </div>
      <ol class="leaderboard-list">${rows}</ol>
    </section>
  `;
}

function renderTournamentDetail(state: DetailState<TournamentPublicProfile>, tournamentId: string) {
  if (!state.item) {
    return renderNotFound('Tournament not found');
  }

  const profile = state.item;
  const stages =
    profile.stages && profile.stages.length > 0
      ? profile.stages
      : mockSchedules
          .filter((item) => item.tournamentId === tournamentId)
          .map((item) => ({
            stageId: item.stageId,
            name: item.stageName,
            status: item.stageStatus,
            roundCount: 1,
            tableCount: 0,
            pendingTablePlanCount: 0,
          }));

  return `
    <section class="detail-page">
      <a class="detail-back" href="#/public">Back to public hall</a>
      <section class="detail-hero">
        <div>
          <p class="eyebrow">Tournament</p>
          <h1>${profile.name}</h1>
          <p class="detail-hero__tagline">${profile.tagline}</p>
          <p class="detail-hero__summary">${profile.description}</p>
        </div>
        ${createSourceBadge(state.source, state.warning)}
      </section>
      <section class="detail-grid">
        <article class="detail-card">
          <h2>Public tournament info</h2>
          <dl class="detail-list">
            <div><dt>Status</dt><dd>${getTournamentStatusLabel(profile.status)}</dd></div>
            <div><dt>Organizer</dt><dd>${profile.venue}</dd></div>
            <div><dt>Stage count</dt><dd>${profile.stageCount}</dd></div>
            <div><dt>Whitelist type</dt><dd>${profile.whitelistType}</dd></div>
            <div><dt>Next stage</dt><dd>${profile.nextStageName}</dd></div>
            <div><dt>Start time</dt><dd>${formatDateTime(profile.nextScheduledAt)}</dd></div>
          </dl>
        </article>
        <article class="detail-card">
          <h2>Stage overview</h2>
          <ul class="detail-rows">
            ${stages
              .map(
                (stage) => `
                  <li>
                    <strong>${stage.name}</strong>
                    <span>${getStageStatusLabel(stage.status)} / ${stage.tableCount} tables / ${stage.roundCount} rounds</span>
                  </li>
                `,
              )
              .join('')}
          </ul>
        </article>
      </section>
    </section>
  `;
}

function renderClubDetail(state: DetailState<ClubPublicProfile>) {
  if (!state.item) {
    return renderNotFound('Club not found');
  }

  const profile = state.item;

  return `
    <section class="detail-page">
      <a class="detail-back" href="#/public">Back to public hall</a>
      <section class="detail-hero">
        <div>
          <p class="eyebrow">Club</p>
          <h1>${profile.name}</h1>
          <p class="detail-hero__tagline">${profile.slogan}</p>
          <p class="detail-hero__summary">${profile.description}</p>
        </div>
        ${createSourceBadge(state.source, state.warning)}
      </section>
      <section class="detail-grid">
        <article class="detail-card">
          <h2>Public club info</h2>
          <dl class="detail-list">
            <div><dt>Members</dt><dd>${profile.memberCount}</dd></div>
            <div><dt>Power</dt><dd>${profile.powerRating}</dd></div>
            <div><dt>Treasury</dt><dd>${formatNumber(profile.treasury)}</dd></div>
            <div><dt>Relations</dt><dd>${profile.relations.map(getRelationLabel).join(' / ') || '--'}</dd></div>
            <div><dt>Featured players</dt><dd>${profile.featuredPlayers.join(' / ') || '--'}</dd></div>
          </dl>
        </article>
        <article class="detail-card">
          <h2>Recent tournaments</h2>
          <ul class="detail-rows">
            ${
              profile.activeTournaments.length > 0
                ? profile.activeTournaments
                    .map(
                      (item) => `
                        <li>
                          <strong>${item}</strong>
                          <span>Visible from the public club profile endpoint.</span>
                        </li>
                      `,
                    )
                    .join('')
                : '<li class="public-hall__empty">No recent tournament entries were returned.</li>'
            }
          </ul>
        </article>
      </section>
    </section>
  `;
}

function renderNotFound(title: string) {
  return `
    <section class="detail-page">
      <a class="detail-back" href="#/public">Back to public hall</a>
      <section class="detail-hero">
        <div>
          <p class="eyebrow">Not Found</p>
          <h1>${title}</h1>
          <p class="detail-hero__summary">The requested public detail view is not available right now.</p>
        </div>
      </section>
    </section>
  `;
}

function renderHome(
  schedules: LoadState<PublicSchedule>,
  leaderboard: LoadState<PlayerLeaderboardEntry>,
  clubs: LoadState<ClubSummary>,
  state: PublicHallState,
) {
  const activeViewMarkup =
    state.activeView === 'clubs'
      ? renderClubsView(clubs, state)
      : state.activeView === 'leaderboard'
        ? renderLeaderboardView(leaderboard, state, clubs.envelope.items)
        : renderSchedulesView(schedules, state);

  return `
    <section class="public-portal">
      ${renderPortalHero(schedules, leaderboard, clubs)}
      ${renderOverviewStrip(schedules, leaderboard, clubs)}
      ${renderSectionTabs(state.activeView)}
      ${activeViewMarkup}
    </section>
  `;
}

function renderLoading() {
  return `
    <section class="public-portal">
      <section class="portal-hero portal-hero--loading">
        <div class="portal-hero__main">
          <p class="portal-hero__eyebrow">Guest Lobby</p>
          <h1>Loading public hall...</h1>
          <p class="portal-hero__summary">Fetching public schedules, club cards, and leaderboard data.</p>
        </div>
      </section>
    </section>
  `;
}

function renderError(message: string) {
  return `
    <section class="public-portal">
      <section class="portal-hero portal-hero--loading">
        <div class="portal-hero__main">
          <p class="portal-hero__eyebrow">Guest Lobby</p>
          <h1>Public hall failed to render</h1>
          <p class="portal-hero__summary">${message}</p>
        </div>
      </section>
    </section>
  `;
}

export async function initPublicHall(container: HTMLElement) {
  const state: PublicHallState = { ...DEFAULT_STATE };

  async function render() {
    const route = getRoute();

    if (route.page === 'tournament') {
      container.innerHTML = renderLoading();
      const detailState = await loadTournamentDetail(route.tournamentId);
      container.innerHTML = renderTournamentDetail(detailState, route.tournamentId);
      return;
    }

    if (route.page === 'club') {
      container.innerHTML = renderLoading();
      const detailState = await loadClubDetail(route.clubId);
      container.innerHTML = renderClubDetail(detailState);
      return;
    }

    container.innerHTML = renderLoading();

    try {
      const { schedules, leaderboard, clubs } = await loadHomeData(state);
      container.innerHTML = renderHome(schedules, leaderboard, clubs, state);
      bindEvents();
    } catch (error) {
      container.innerHTML = renderError(
        error instanceof Error ? error.message : 'Public hall failed to render.',
      );
    }
  }

  function bindEvents() {
    container.querySelectorAll<HTMLElement>('[data-view]').forEach((element) => {
      element.addEventListener('click', () => {
        const view = element.dataset.view as PublicView | undefined;
        if (!view) return;
        state.activeView = view;
        window.location.hash = '/public';
        void render();
      });
    });

    container
      .querySelector<HTMLSelectElement>('[data-filter="schedule-tournament-status"]')
      ?.addEventListener('change', (event) => {
        state.scheduleTournamentStatus = (event.currentTarget as HTMLSelectElement).value as TournamentStatus | '';
        void render();
      });

    container
      .querySelector<HTMLSelectElement>('[data-filter="schedule-stage-status"]')
      ?.addEventListener('change', (event) => {
        state.scheduleStageStatus = (event.currentTarget as HTMLSelectElement).value as StageStatus | '';
        void render();
      });

    container
      .querySelector<HTMLSelectElement>('[data-filter="leaderboard-club"]')
      ?.addEventListener('change', (event) => {
        state.leaderboardClubId = (event.currentTarget as HTMLSelectElement).value;
        void render();
      });

    container
      .querySelector<HTMLSelectElement>('[data-filter="leaderboard-status"]')
      ?.addEventListener('change', (event) => {
        state.leaderboardStatus = (event.currentTarget as HTMLSelectElement).value as PublicHallState['leaderboardStatus'];
        void render();
      });

    container
      .querySelector<HTMLInputElement>('[data-filter="club-active-only"]')
      ?.addEventListener('change', (event) => {
        state.clubActiveOnly = (event.currentTarget as HTMLInputElement).checked;
        void render();
      });

    container
      .querySelectorAll<HTMLButtonElement>('[data-action="reload-public-hall"]')
      .forEach((button) => {
        button.addEventListener('click', () => {
          void render();
        });
      });
  }

  await render();
}