import { apiClient } from '../api/client';
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

let activeHashListenerController: AbortController | null = null;

function getRoute(): PublicRoute {
  const hash = window.location.hash.replace(/^#/, '');

  if (!hash || hash === '/') {
    return { page: 'home' };
  }

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
      '': '全部赛事',
      Draft: '筹备中',
      Registration: '报名中',
      InProgress: '进行中',
      Finished: '已结束',
    } as const
  )[status];
}

function getStageStatusLabel(status: StageStatus | '') {
  return (
    {
      '': '全部赛段',
      Pending: '待开始',
      Active: '进行中',
      Completed: '已完成',
    } as const
  )[status];
}

function getRelationLabel(relation: ClubSummary['relations'][number]) {
  return relation === 'Alliance' ? '联盟' : '敌对';
}

function getLeaderboardStatusLabel(status: PublicHallState['leaderboardStatus']) {
  return (
    {
      '': '全部状态',
      Active: '活跃',
      Inactive: '停用',
      Banned: '封禁',
    } as const
  )[status];
}

async function loadSchedules(state: PublicHallState): Promise<LoadState<PublicSchedule>> {
  try {
    const envelope = await apiClient.getPublicSchedules({
      tournamentStatus: state.scheduleTournamentStatus || undefined,
      stageStatus: state.scheduleStageStatus || undefined,
      limit: 6,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    const items = mockSchedules.filter((item) => {
      const matchTournament =
        !state.scheduleTournamentStatus || item.tournamentStatus === state.scheduleTournamentStatus;
      const matchStage = !state.scheduleStageStatus || item.stageStatus === state.scheduleStageStatus;
      return matchTournament && matchStage;
    });

    return {
      envelope: toMockEnvelope(items, {
        tournamentStatus: state.scheduleTournamentStatus,
        stageStatus: state.scheduleStageStatus,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : '公开赛程接口暂不可用，当前展示默认数据。',
    };
  }
}

async function loadLeaderboard(
  state: PublicHallState,
): Promise<LoadState<PlayerLeaderboardEntry>> {
  try {
    const envelope = await apiClient.getPublicPlayerLeaderboard({
      clubId: state.leaderboardClubId || undefined,
      status: state.leaderboardStatus || undefined,
      limit: 12,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    const selectedClubName = mockClubs.find((club) => club.id === state.leaderboardClubId)?.name;
    const items = mockLeaderboard.filter((item) => {
      const matchClub = !selectedClubName || item.clubName === selectedClubName;
      const matchStatus = !state.leaderboardStatus || item.status === state.leaderboardStatus;
      return matchClub && matchStatus;
    });

    return {
      envelope: toMockEnvelope(items, {
        clubId: state.leaderboardClubId,
        status: state.leaderboardStatus,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : '排行榜接口暂不可用，当前展示默认数据。',
    };
  }
}

async function loadClubs(state: PublicHallState): Promise<LoadState<ClubSummary>> {
  try {
    const envelope = await apiClient.getClubs({
      activeOnly: state.clubActiveOnly,
      limit: 12,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    return {
      envelope: toMockEnvelope(mockClubs, { activeOnly: state.clubActiveOnly }),
      source: 'mock',
      warning: error instanceof Error ? error.message : '俱乐部接口暂不可用，当前展示默认数据。',
    };
  }
}

async function loadTournamentDetail(tournamentId: string): Promise<DetailState<TournamentPublicProfile>> {
  try {
    const item = await apiClient.getPublicTournamentProfile(tournamentId);
    return { item, source: 'api' };
  } catch (error) {
    return {
      item: mockTournamentProfiles.find((profile) => profile.id === tournamentId) ?? null,
      source: 'mock',
      warning: error instanceof Error ? error.message : '赛事详情接口暂不可用，当前展示默认数据。',
    };
  }
}

async function loadClubDetail(clubId: string): Promise<DetailState<ClubPublicProfile>> {
  try {
    const item = await apiClient.getPublicClubProfile(clubId);
    return { item, source: 'api' };
  } catch (error) {
    return {
      item: mockClubProfiles.find((profile) => profile.id === clubId) ?? null,
      source: 'mock',
      warning: error instanceof Error ? error.message : '俱乐部详情接口暂不可用，当前展示默认数据。',
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
          <span class="portal-inline-badge">${schedules.source === 'api' ? '实时接口' : '演示数据'}</span>
        </div>
        <h1>游客可以在这里查看赛事、俱乐部与公开排行榜。</h1>
        <p class="portal-hero__summary">
          公开区只提供只读访问，但已经把赛事节奏、俱乐部生态和头部玩家表现组织成一个完整入口。
        </p>
        <div class="portal-hero__highlights">
          <article class="portal-highlight">
            <span>当前赛程焦点</span>
            <strong>${nextSchedule ? nextSchedule.stageName : '暂无排期'}</strong>
            <small>${nextSchedule ? formatDateTime(nextSchedule.scheduledAt) : '等待赛程更新'}</small>
          </article>
          <article class="portal-highlight">
            <span>当前榜首</span>
            <strong>${topPlayer ? topPlayer.nickname : '--'}</strong>
            <small>${topPlayer ? `${topPlayer.clubName} · ELO ${topPlayer.elo}` : '等待排行更新'}</small>
          </article>
        </div>
        <div class="portal-hero__quicklinks">
          <button type="button" class="portal-chip" data-view="schedules">查看赛程</button>
          <button type="button" class="portal-chip" data-view="clubs">浏览俱乐部</button>
          <button type="button" class="portal-chip" data-view="leaderboard">打开排行</button>
        </div>
      </div>
      <aside class="portal-hero__aside">
        <article class="portal-stat portal-stat--accent">
          <span>下一场公开赛事</span>
          <strong>${nextSchedule ? nextSchedule.tournamentName : '--'}</strong>
          <small>${nextSchedule ? `${nextSchedule.stageName} · ${formatDateTime(nextSchedule.scheduledAt)}` : '暂无赛程'}</small>
        </article>
        <article class="portal-stat">
          <span>公开俱乐部</span>
          <strong>${clubs.envelope.total}</strong>
          <small>${featuredClub ? `${featuredClub.name} · Power ${featuredClub.powerRating}` : '暂无俱乐部数据'}</small>
        </article>
        <article class="portal-stat">
          <span>排行榜默认状态</span>
          <strong>${getLeaderboardStatusLabel('Active')}</strong>
          <small>默认展示活跃玩家</small>
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
      title: '公开赛程',
      value: `${schedules.envelope.total}`,
      detail: schedules.envelope.items[0]
        ? `${schedules.envelope.items[0].tournamentName} 正在更新`
        : '等待赛程数据',
    },
    {
      title: '俱乐部目录',
      value: `${clubs.envelope.total}`,
      detail: clubs.envelope.items[0]
        ? `${clubs.envelope.items[0].name} 进入公开展示`
        : '等待俱乐部数据',
    },
    {
      title: '公开排行',
      value: `${leaderboard.envelope.total}`,
      detail: leaderboard.envelope.items[0]
        ? `${leaderboard.envelope.items[0].nickname} 位列榜首`
        : '等待排行数据',
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
    { id: 'schedules', label: '赛程大厅', summary: '以时间轴方式浏览公开赛事与赛段进度。' },
    { id: 'clubs', label: '俱乐部橱窗', summary: '查看俱乐部实力、关系和核心资源。' },
    { id: 'leaderboard', label: '选手排行', summary: '快速查看 ELO 排名和选手状态。' },
  ];

  return `
    <nav class="portal-tabs" aria-label="公共大厅导航">
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
                    <dt>开始时间</dt>
                    <dd>${formatDateTime(item.scheduledAt)}</dd>
                  </div>
                  <div>
                    <dt>赛事编号</dt>
                    <dd>${item.tournamentId}</dd>
                  </div>
                </dl>
                <a class="detail-link" href="${tournamentHref(item.tournamentId)}">查看赛事详情</a>
              </article>
            `,
          )
          .join('')
      : '<p class="public-hall__empty">当前筛选条件下没有公开赛程。</p>';

  return `
    <section class="portal-section">
      <div class="portal-section__head">
        <div>
          <p class="eyebrow">Schedules</p>
          <h2>公开赛程</h2>
          <p>以卡片方式展示当前开放给游客浏览的赛事进度与下一阶段安排。</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <div class="portal-filters">
        <label>
          <span>赛事状态</span>
          <select data-filter="schedule-tournament-status">
            <option value="" ${state.scheduleTournamentStatus === '' ? 'selected' : ''}>全部</option>
            <option value="Draft" ${state.scheduleTournamentStatus === 'Draft' ? 'selected' : ''}>Draft</option>
            <option value="Registration" ${state.scheduleTournamentStatus === 'Registration' ? 'selected' : ''}>Registration</option>
            <option value="InProgress" ${state.scheduleTournamentStatus === 'InProgress' ? 'selected' : ''}>InProgress</option>
            <option value="Finished" ${state.scheduleTournamentStatus === 'Finished' ? 'selected' : ''}>Finished</option>
          </select>
        </label>
        <label>
          <span>赛段状态</span>
          <select data-filter="schedule-stage-status">
            <option value="" ${state.scheduleStageStatus === '' ? 'selected' : ''}>全部</option>
            <option value="Pending" ${state.scheduleStageStatus === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Active" ${state.scheduleStageStatus === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Completed" ${state.scheduleStageStatus === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </label>
        <button type="button" class="portal-refresh" data-action="reload-public-hall">刷新</button>
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
                    <p class="club-card__subtitle">${club.memberCount} 名成员</p>
                  </div>
                  <span class="club-card__power">Power ${club.powerRating}</span>
                </div>
                <p>展示俱乐部战力、公开关系与基础资源，游客只读浏览，不提供管理入口。</p>
                <div class="club-card__stats">
                  <div>
                    <span>资金池</span>
                    <strong>${formatNumber(club.treasury)}</strong>
                  </div>
                  <div>
                    <span>关系</span>
                    <strong>${club.relations.map(getRelationLabel).join(' / ')}</strong>
                  </div>
                </div>
                <a class="detail-link" href="${clubHref(club.id)}">查看俱乐部详情</a>
              </article>
            `,
          )
          .join('')
      : '<p class="public-hall__empty">当前没有可展示的俱乐部资料。</p>';

  return `
    <section class="portal-section">
      <div class="portal-section__head">
        <div>
          <p class="eyebrow">Clubs</p>
          <h2>俱乐部橱窗</h2>
          <p>把目录页做成更像展示页的浏览体验，同时保留只读限制。</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <div class="portal-filters">
        <label class="portal-checkbox">
          <input type="checkbox" data-filter="club-active-only" ${state.clubActiveOnly ? 'checked' : ''} />
          <span>仅显示活跃俱乐部</span>
        </label>
        <button type="button" class="portal-refresh" data-action="reload-public-hall">刷新</button>
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
    '<option value="">全部俱乐部</option>',
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
            const clubLink = club
              ? `<a class="leaderboard-row__link" href="${clubHref(club.id)}">查看俱乐部</a>`
              : '';

            return `
              <li class="leaderboard-row">
                <div class="leaderboard-row__rank">${item.rank || index + 1}</div>
                <div class="leaderboard-row__main">
                  <strong>${item.nickname}</strong>
                  <span>${item.clubName}</span>
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
      : '<p class="public-hall__empty">当前筛选下没有排行榜数据。</p>';

  return `
    <section class="portal-section">
      <div class="portal-section__head">
        <div>
          <p class="eyebrow">Leaderboard</p>
          <h2>公开排行榜</h2>
          <p>保留筛选逻辑，同时把信息层级调整成更适合游客浏览的榜单布局。</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <div class="portal-filters">
        <label>
          <span>俱乐部</span>
          <select data-filter="leaderboard-club">${clubOptions}</select>
        </label>
        <label>
          <span>选手状态</span>
          <select data-filter="leaderboard-status">
            <option value="" ${state.leaderboardStatus === '' ? 'selected' : ''}>全部</option>
            <option value="Active" ${state.leaderboardStatus === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${state.leaderboardStatus === 'Inactive' ? 'selected' : ''}>Inactive</option>
            <option value="Banned" ${state.leaderboardStatus === 'Banned' ? 'selected' : ''}>Banned</option>
          </select>
        </label>
        <button type="button" class="portal-refresh" data-action="reload-public-hall">刷新</button>
      </div>
      <ol class="leaderboard-list">${rows}</ol>
    </section>
  `;
}

function renderTournamentDetail(state: DetailState<TournamentPublicProfile>, tournamentId: string) {
  if (!state.item) {
    return renderNotFound('找不到对应赛事');
  }

  const profile = state.item;
  const relatedSchedules = mockSchedules.filter((item) => item.tournamentId === tournamentId);

  return `
    <section class="detail-page">
      <a class="detail-back" href="#/">返回公共大厅</a>
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
          <h2>赛事信息</h2>
          <dl class="detail-list">
            <div><dt>赛事状态</dt><dd>${getTournamentStatusLabel(profile.status)}</dd></div>
            <div><dt>举办地</dt><dd>${profile.venue}</dd></div>
            <div><dt>赛段数量</dt><dd>${profile.stageCount}</dd></div>
            <div><dt>白名单模式</dt><dd>${profile.whitelistType}</dd></div>
            <div><dt>下一赛段</dt><dd>${profile.nextStageName}</dd></div>
            <div><dt>开始时间</dt><dd>${formatDateTime(profile.nextScheduledAt)}</dd></div>
          </dl>
        </article>
        <article class="detail-card">
          <h2>公开排期</h2>
          <ul class="detail-rows">
            ${relatedSchedules
              .map(
                (schedule) => `
                  <li>
                    <strong>${schedule.stageName}</strong>
                    <span>${getStageStatusLabel(schedule.stageStatus)} · ${formatDateTime(schedule.scheduledAt)}</span>
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
    return renderNotFound('找不到对应俱乐部');
  }

  const profile = state.item;

  return `
    <section class="detail-page">
      <a class="detail-back" href="#/">返回公共大厅</a>
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
          <h2>公开资料</h2>
          <dl class="detail-list">
            <div><dt>成员数</dt><dd>${profile.memberCount}</dd></div>
            <div><dt>Power</dt><dd>${profile.powerRating}</dd></div>
            <div><dt>资金池</dt><dd>${formatNumber(profile.treasury)}</dd></div>
            <div><dt>关系</dt><dd>${profile.relations.map(getRelationLabel).join(' / ')}</dd></div>
            <div><dt>代表选手</dt><dd>${profile.featuredPlayers.join(' / ')}</dd></div>
          </dl>
        </article>
        <article class="detail-card">
          <h2>参与赛事</h2>
          <ul class="detail-rows">
            ${profile.activeTournaments
              .map(
                (item) => `
                  <li>
                    <strong>${item}</strong>
                    <span>游客可查看赛事概览，但无法进行报名或管理操作。</span>
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

function renderNotFound(title: string) {
  return `
    <section class="detail-page">
      <a class="detail-back" href="#/">返回公共大厅</a>
      <section class="detail-hero">
        <div>
          <p class="eyebrow">Not Found</p>
          <h1>${title}</h1>
          <p class="detail-hero__summary">当前没有找到可展示的公开详情数据，请返回首页继续浏览。</p>
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
          <h1>正在加载公共大厅内容...</h1>
          <p class="portal-hero__summary">赛事、俱乐部和排行榜会在数据准备完成后出现在这里。</p>
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

    const [schedules, leaderboard, clubs] = await Promise.all([
      loadSchedules(state),
      loadLeaderboard(state),
      loadClubs(state),
    ]);

    container.innerHTML = renderHome(schedules, leaderboard, clubs, state);
    bindEvents();
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
        const target = event.currentTarget as HTMLSelectElement;
        state.scheduleTournamentStatus = target.value as TournamentStatus | '';
        void render();
      });

    container
      .querySelector<HTMLSelectElement>('[data-filter="schedule-stage-status"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        state.scheduleStageStatus = target.value as StageStatus | '';
        void render();
      });

    container
      .querySelector<HTMLSelectElement>('[data-filter="leaderboard-club"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        state.leaderboardClubId = target.value;
        void render();
      });

    container
      .querySelector<HTMLSelectElement>('[data-filter="leaderboard-status"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        state.leaderboardStatus = target.value as PublicHallState['leaderboardStatus'];
        void render();
      });

    container
      .querySelector<HTMLInputElement>('[data-filter="club-active-only"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLInputElement;
        state.clubActiveOnly = target.checked;
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

  activeHashListenerController?.abort();
  activeHashListenerController = new AbortController();

  window.addEventListener(
    'hashchange',
    () => {
      void render();
    },
    { signal: activeHashListenerController.signal },
  );

  await render();
}
