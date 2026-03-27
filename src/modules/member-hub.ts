import { apiClient } from '../api/client';
import type { DashboardSummary, Role } from '../domain/models';
import {
  readClubApplicationInbox,
  updateClubApplicationInboxStatus,
} from '../lib/club-applications';
import { mockClubs, mockDashboards } from '../mocks/overview';

type DataSource = 'api' | 'mock';

interface DashboardLoadState {
  dashboard: DashboardSummary | null;
  source: DataSource;
  warning?: string;
}

interface MockOperator {
  id: string;
  label: string;
  role: Role;
  playerId: string;
  managedClubIds: string[];
}

interface MemberHubState {
  operatorId: string;
  playerId: string;
  clubId: string;
}

const mockOperators: MockOperator[] = [
  {
    id: 'player-a',
    label: 'Aoi / Registered Player',
    role: 'RegisteredPlayer',
    playerId: 'player-a',
    managedClubIds: [],
  },
  {
    id: 'player-club-admin',
    label: 'Saki / Club Admin',
    role: 'ClubAdmin',
    playerId: 'player-b',
    managedClubIds: ['club-1', 'club-2'],
  },
];

const DEFAULT_STATE: MemberHubState = {
  operatorId: mockOperators[0].id,
  playerId: 'player-a',
  clubId: 'club-1',
};

function createSourceBadge(source: DataSource, warning?: string) {
  return `
    <div class="public-hall__meta">
      <span class="source-badge source-badge--${source}">${source === 'api' ? 'API' : 'Mock'}</span>
      ${warning ? `<p class="public-hall__warning">${warning}</p>` : ''}
    </div>
  `;
}

function findMockDashboard(ownerId: string) {
  return mockDashboards.find((item) => item.ownerId === ownerId) ?? null;
}

async function loadPlayerDashboard(playerId: string, operatorId: string): Promise<DashboardLoadState> {
  try {
    const dashboard = await apiClient.getPlayerDashboard(playerId, operatorId);
    return { dashboard, source: 'api' };
  } catch (error) {
    return {
      dashboard: findMockDashboard(playerId),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Player dashboard fallback to mock.',
    };
  }
}

async function loadClubDashboard(clubId: string, operatorId: string): Promise<DashboardLoadState> {
  try {
    const dashboard = await apiClient.getClubDashboard(clubId, operatorId);
    return { dashboard, source: 'api' };
  } catch (error) {
    return {
      dashboard: findMockDashboard(clubId),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club dashboard fallback to mock.',
    };
  }
}

function renderMetrics(dashboard: DashboardSummary | null) {
  if (!dashboard) {
    return '<p class="public-hall__empty">当前没有可展示的面板数据。</p>';
  }

  return `
    <p>${dashboard.headline}</p>
    <div class="metric-grid">
      ${dashboard.metrics
        .map(
          (metric) => `
            <div class="metric metric--${metric.accent ?? 'default'}">
              <span>${metric.label}</span>
              <strong>${metric.value}</strong>
            </div>
          `,
        )
        .join('')}
    </div>
  `;
}

function renderClubApplicationInbox(clubId: string, role: Role) {
  if (role !== 'ClubAdmin') {
    return `
      <article class="card panel-card">
        <div class="public-hall__panel-head">
          <div>
            <h3>入部申请收件箱</h3>
            <p>这块只对俱乐部管理员开放，注册玩家不会看到审批视图。</p>
          </div>
        </div>
        <p class="public-hall__empty">当前操作人不是 Club Admin。</p>
      </article>
    `;
  }

  const items = readClubApplicationInbox().filter((item) => item.clubId === clubId);
  const pendingCount = items.filter((item) => item.status === 'Pending').length;

  return `
    <article class="card panel-card">
      <div class="public-hall__panel-head">
        <div>
          <h3>入部申请收件箱</h3>
          <p>当前先用前端暂存流水承接主页申请，等后端补查询/审批接口后可直接替换为真实收件箱。</p>
        </div>
        <span class="source-badge source-badge--mock">Pending ${pendingCount}</span>
      </div>
      <ul class="list">
        ${
          items.length > 0
            ? items
                .map(
                  (item) => `
                    <li class="list-row">
                      <div>
                        <strong>${item.applicantName}</strong>
                        <span>${item.message}</span>
                      </div>
                      <div>
                        <span>${item.status}</span>
                        <span>${item.source.toUpperCase()} / ${item.operatorId}</span>
                        ${
                          item.status === 'Pending'
                            ? `
                              <div class="inline-actions">
                                <button type="button" class="portal-refresh" data-action="approve-application" data-application-id="${item.id}">
                                  批准
                                </button>
                                <button type="button" class="portal-refresh" data-action="reject-application" data-application-id="${item.id}">
                                  拒绝
                                </button>
                              </div>
                            `
                            : ''
                        }
                      </div>
                    </li>
                  `,
                )
                .join('')
            : '<li class="list-row public-hall__empty">当前还没有这个俱乐部的申请记录。</li>'
        }
      </ul>
    </article>
  `;
}

function renderMemberHubLayout(
  state: MemberHubState,
  playerPayload: DashboardLoadState,
  clubPayload: DashboardLoadState,
) {
  const activeOperator =
    mockOperators.find((operator) => operator.id === state.operatorId) ?? mockOperators[0];
  const clubOptions = mockClubs
    .map((club) => {
      const disabled =
        activeOperator.role !== 'ClubAdmin' || !activeOperator.managedClubIds.includes(club.id);
      return `
        <option
          value="${club.id}"
          ${club.id === state.clubId ? 'selected' : ''}
          ${disabled ? 'disabled' : ''}
        >
          ${club.name}
        </option>
      `;
    })
    .join('');

  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">1. Member Hub</p>
        <h2>第二步：注册玩家和俱乐部管理员工作台入口</h2>
        <p>
          这一层主要验证 dashboard 读取必须显式传入 operatorId，
          同时把玩家面板和俱乐部面板的访问入口提前定型。
        </p>
      </div>
      <div class="card member-hub__controls">
        <div class="public-hall__filters-head">
          <h3>工作台上下文</h3>
          <button type="button" data-action="reload-member-hub">刷新面板</button>
        </div>
        <div class="public-hall__toolbar">
          <label>
            <span>当前操作人</span>
            <select data-filter="member-operator">
              ${mockOperators
                .map(
                  (operator) => `
                    <option value="${operator.id}" ${operator.id === state.operatorId ? 'selected' : ''}>
                      ${operator.label}
                    </option>
                  `,
                )
                .join('')}
            </select>
          </label>
          <label>
            <span>查看玩家</span>
            <select data-filter="member-player">
              <option value="player-a" ${state.playerId === 'player-a' ? 'selected' : ''}>Aoi</option>
              <option value="player-b" ${state.playerId === 'player-b' ? 'selected' : ''}>Mika</option>
            </select>
          </label>
          <label>
            <span>查看俱乐部</span>
            <select data-filter="member-club">
              ${clubOptions}
            </select>
          </label>
        </div>
      </div>
      <div class="member-hub__grid">
        <article class="card dashboard-card">
          <div class="public-hall__panel-head">
            <div>
              <h3>玩家数据面板</h3>
              <p>接口：/dashboards/players/${state.playerId}?operatorId=${state.operatorId}</p>
            </div>
            ${createSourceBadge(playerPayload.source, playerPayload.warning)}
          </div>
          ${renderMetrics(playerPayload.dashboard)}
        </article>
        <article class="card dashboard-card">
          <div class="public-hall__panel-head">
            <div>
              <h3>俱乐部数据面板</h3>
              <p>接口：/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}</p>
            </div>
            ${createSourceBadge(clubPayload.source, clubPayload.warning)}
          </div>
          ${
            activeOperator.role === 'ClubAdmin'
              ? renderMetrics(clubPayload.dashboard)
              : '<p class="public-hall__empty">当前操作人不是俱乐部管理员，俱乐部面板入口会在真实登录态下受角色控制。</p>'
          }
        </article>
        ${renderClubApplicationInbox(state.clubId, activeOperator.role)}
      </div>
    </section>
  `;
}

function renderLoading() {
  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">1. Member Hub</p>
        <h2>第二步：注册玩家和俱乐部管理员工作台入口</h2>
        <p>正在加载成员工作台数据。</p>
      </div>
      <div class="card public-hall__loading">Loading member dashboards...</div>
    </section>
  `;
}

export async function initMemberHub(container: HTMLElement) {
  const state: MemberHubState = { ...DEFAULT_STATE };

  async function render() {
    container.innerHTML = renderLoading();

    const activeOperator =
      mockOperators.find((operator) => operator.id === state.operatorId) ?? mockOperators[0];

    if (!activeOperator.managedClubIds.includes(state.clubId)) {
      state.clubId = activeOperator.managedClubIds[0] ?? mockClubs[0].id;
    }

    const [playerPayload, clubPayload] = await Promise.all([
      loadPlayerDashboard(state.playerId, state.operatorId),
      loadClubDashboard(state.clubId, state.operatorId),
    ]);

    container.innerHTML = renderMemberHubLayout(state, playerPayload, clubPayload);
    bindEvents();
  }

  function bindEvents() {
    container
      .querySelector<HTMLSelectElement>('[data-filter="member-operator"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        state.operatorId = target.value;
        void render();
      });

    container
      .querySelector<HTMLSelectElement>('[data-filter="member-player"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        state.playerId = target.value;
        void render();
      });

    container
      .querySelector<HTMLSelectElement>('[data-filter="member-club"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        state.clubId = target.value;
        void render();
      });

    container
      .querySelector<HTMLButtonElement>('[data-action="reload-member-hub"]')
      ?.addEventListener('click', () => {
        void render();
      });

    container
      .querySelectorAll<HTMLButtonElement>('[data-action="approve-application"]')
      .forEach((button) => {
        button.addEventListener('click', () => {
          const applicationId = button.dataset.applicationId;
          if (!applicationId) {
            return;
          }
          updateClubApplicationInboxStatus(applicationId, 'Approved');
          void render();
        });
      });

    container
      .querySelectorAll<HTMLButtonElement>('[data-action="reject-application"]')
      .forEach((button) => {
        button.addEventListener('click', () => {
          const applicationId = button.dataset.applicationId;
          if (!applicationId) {
            return;
          }
          updateClubApplicationInboxStatus(applicationId, 'Rejected');
          void render();
        });
      });
  }

  await render();
}
