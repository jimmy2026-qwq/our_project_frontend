import { apiClient } from '../api/client';
import type {
  ClubSummary,
  ListEnvelope,
  PlayerLeaderboardEntry,
  PublicSchedule,
  StageStatus,
  TournamentStatus,
} from '../domain/models';
import { mockClubs, mockLeaderboard, mockSchedules, toMockEnvelope } from '../mocks/overview';

type DataSource = 'api' | 'mock';

interface LoadState<T> {
  envelope: ListEnvelope<T>;
  source: DataSource;
  warning?: string;
}

interface PublicHallState {
  scheduleTournamentStatus: TournamentStatus | '';
  scheduleStageStatus: StageStatus | '';
  leaderboardClubId: string;
  leaderboardStatus: 'Active' | 'Inactive' | 'Banned' | '';
  clubActiveOnly: boolean;
}

const DEFAULT_STATE: PublicHallState = {
  scheduleTournamentStatus: 'InProgress',
  scheduleStageStatus: 'Active',
  leaderboardClubId: '',
  leaderboardStatus: 'Active',
  clubActiveOnly: true,
};

function createSourceBadge(source: DataSource, warning?: string) {
  return `
    <div class="public-hall__meta">
      <span class="source-badge source-badge--${source}">${source === 'api' ? 'API' : 'Mock'}</span>
      ${warning ? `<p class="public-hall__warning">${warning}</p>` : ''}
    </div>
  `;
}

function formatScheduleTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value);
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

async function loadLeaderboard(
  state: PublicHallState,
): Promise<LoadState<PlayerLeaderboardEntry>> {
  try {
    const envelope = await apiClient.getPublicPlayerLeaderboard({
      clubId: state.leaderboardClubId || undefined,
      status: state.leaderboardStatus || undefined,
      limit: 10,
      offset: 0,
    });

    return { envelope, source: 'api' };
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
      warning: error instanceof Error ? error.message : 'Leaderboard fallback to mock.',
    };
  }
}

async function loadClubs(state: PublicHallState): Promise<LoadState<ClubSummary>> {
  try {
    const envelope = await apiClient.getClubs({
      activeOnly: state.clubActiveOnly,
      limit: 10,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    return {
      envelope: toMockEnvelope(mockClubs, { activeOnly: state.clubActiveOnly }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club list fallback to mock.',
    };
  }
}

function renderSchedulesBlock(payload: LoadState<PublicSchedule>) {
  const items =
    payload.envelope.items.length > 0
      ? payload.envelope.items
          .map(
            (item) => `
              <li class="list-row">
                <div>
                  <strong>${item.tournamentName}</strong>
                  <span>${item.stageName}</span>
                </div>
                <div>
                  <span>${item.tournamentStatus} / ${item.stageStatus}</span>
                  <span>${formatScheduleTime(item.scheduledAt)}</span>
                </div>
              </li>
            `,
          )
          .join('')
      : '<li class="list-row public-hall__empty">没有符合条件的赛程。</li>';

  return `
    <article class="card panel-card">
      <div class="public-hall__panel-head">
        <div>
          <h3>公开赛程</h3>
          <p>对应 /public/schedules，优先给游客和普通玩家使用。</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <ul class="list">${items}</ul>
    </article>
  `;
}

function renderLeaderboardBlock(
  payload: LoadState<PlayerLeaderboardEntry>,
  clubs: ClubSummary[],
  state: PublicHallState,
) {
  const clubOptions = [
    '<option value="">全部俱乐部</option>',
    ...clubs.map(
      (club) =>
        `<option value="${club.id}" ${club.id === state.leaderboardClubId ? 'selected' : ''}>${club.name}</option>`,
    ),
  ].join('');

  const items =
    payload.envelope.items.length > 0
      ? payload.envelope.items
          .map(
            (item) => `
              <li class="list-row">
                <div>
                  <strong>#${item.rank} ${item.nickname}</strong>
                  <span>${item.clubName}</span>
                </div>
                <div>
                  <span>ELO ${item.elo}</span>
                  <span>${item.status}</span>
                </div>
              </li>
            `,
          )
          .join('')
      : '<li class="list-row public-hall__empty">没有符合条件的排行榜数据。</li>';

  return `
    <article class="card panel-card">
      <div class="public-hall__panel-head">
        <div>
          <h3>玩家排行榜</h3>
          <p>支持按俱乐部和状态过滤，适合作为公共展示页入口。</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <div class="public-hall__toolbar">
        <label>
          <span>俱乐部</span>
          <select data-filter="leaderboard-club">${clubOptions}</select>
        </label>
        <label>
          <span>玩家状态</span>
          <select data-filter="leaderboard-status">
            <option value="" ${state.leaderboardStatus === '' ? 'selected' : ''}>全部</option>
            <option value="Active" ${state.leaderboardStatus === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Inactive" ${state.leaderboardStatus === 'Inactive' ? 'selected' : ''}>Inactive</option>
            <option value="Banned" ${state.leaderboardStatus === 'Banned' ? 'selected' : ''}>Banned</option>
          </select>
        </label>
      </div>
      <ul class="list">${items}</ul>
    </article>
  `;
}

function renderClubsBlock(payload: LoadState<ClubSummary>, state: PublicHallState) {
  const items =
    payload.envelope.items.length > 0
      ? payload.envelope.items
          .map(
            (club) => `
              <li class="list-row">
                <div>
                  <strong>${club.name}</strong>
                  <span>${club.memberCount} members</span>
                </div>
                <div>
                  <span>Power ${club.powerRating}</span>
                  <span>¥ ${formatNumber(club.treasury)}</span>
                </div>
              </li>
            `,
          )
          .join('')
      : '<li class="list-row public-hall__empty">没有符合条件的俱乐部。</li>';

  return `
    <article class="card panel-card">
      <div class="public-hall__panel-head">
        <div>
          <h3>俱乐部名录</h3>
          <p>对应 /clubs，现阶段先聚焦公开目录和总览指标。</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <div class="public-hall__toolbar">
        <label class="public-hall__checkbox">
          <input type="checkbox" data-filter="club-active-only" ${state.clubActiveOnly ? 'checked' : ''} />
          <span>仅看活跃俱乐部</span>
        </label>
      </div>
      <ul class="list">${items}</ul>
    </article>
  `;
}

function renderLayout(
  schedules: LoadState<PublicSchedule>,
  leaderboard: LoadState<PlayerLeaderboardEntry>,
  clubs: LoadState<ClubSummary>,
  state: PublicHallState,
) {
  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">0. Public Hall</p>
        <h2>第一步：先打通公共只读区</h2>
        <p>
          这一层优先验证你的列表信封、公共路由和 Guest / RegisteredPlayer 的基础读权限。
          页面采用 API 优先、mock 兜底的方式，方便你在后端接口不完整时继续推进。
        </p>
      </div>
      <div class="card public-hall__filters">
        <div class="public-hall__filters-head">
          <h3>赛程过滤器</h3>
          <button type="button" data-action="reload-public-hall">重新拉取</button>
        </div>
        <div class="public-hall__toolbar">
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
        </div>
      </div>
      <div class="workbench-grid">
        ${renderSchedulesBlock(schedules)}
        ${renderLeaderboardBlock(leaderboard, clubs.envelope.items, state)}
        ${renderClubsBlock(clubs, state)}
      </div>
    </section>
  `;
}

function renderLoading() {
  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">0. Public Hall</p>
        <h2>第一步：先打通公共只读区</h2>
        <p>正在拉取公开赛程、俱乐部名录和玩家排行榜。</p>
      </div>
      <div class="card public-hall__loading">Loading public data...</div>
    </section>
  `;
}

export async function initPublicHall(container: HTMLElement) {
  const state: PublicHallState = { ...DEFAULT_STATE };

  async function render() {
    container.innerHTML = renderLoading();

    const [schedules, leaderboard, clubs] = await Promise.all([
      loadSchedules(state),
      loadLeaderboard(state),
      loadClubs(state),
    ]);

    container.innerHTML = renderLayout(schedules, leaderboard, clubs, state);
    bindEvents();
  }

  function bindEvents() {
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
      .querySelector<HTMLButtonElement>('[data-action="reload-public-hall"]')
      ?.addEventListener('click', () => {
        void render();
      });
  }

  await render();
}
