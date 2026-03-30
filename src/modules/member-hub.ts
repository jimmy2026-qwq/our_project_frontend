import { apiClient } from '../api/client';
import type { ClubApplicationView, DashboardSummary, Role } from '../domain/models';
import {
  readClubApplicationInbox,
  type ClubApplicationInboxItem,
  updateClubApplicationInboxStatus,
} from '../lib/club-applications';
import { mockClubs, mockDashboards } from '../mocks/overview';

type DataSource = 'api' | 'mock';

interface DashboardLoadState {
  dashboard: DashboardSummary | null;
  source: DataSource;
  warning?: string;
}

interface ApplicationInboxState {
  items: ClubApplicationView[];
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
    id: 'player-registered-1',
    label: 'Aoi / Registered Player',
    role: 'RegisteredPlayer',
    playerId: 'player-registered-1',
    managedClubIds: [],
  },
  {
    id: 'player-admin',
    label: 'Saki / Club Admin',
    role: 'ClubAdmin',
    playerId: 'player-registered-2',
    managedClubIds: ['club-1', 'club-2'],
  },
];

const DEFAULT_STATE: MemberHubState = {
  operatorId: mockOperators[0].id,
  playerId: mockOperators[0].playerId,
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
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

function toApplicationView(item: ClubApplicationInboxItem): ClubApplicationView {
  return {
    applicationId: item.id,
    clubId: item.clubId,
    clubName: item.clubName,
    applicant: {
      playerId: item.operatorId,
      displayName: item.applicantName,
    },
    submittedAt: item.submittedAt,
    message: item.message,
    status: item.status,
    reviewedBy: null,
    reviewedByDisplayName: null,
    reviewedAt: null,
    reviewNote: null,
    withdrawnByPrincipalId: null,
    canReview: item.status === 'Pending',
    canWithdraw: false,
  };
}

async function loadClubApplicationInbox(
  clubId: string,
  operatorId: string,
  role: Role,
): Promise<ApplicationInboxState> {
  if (role !== 'ClubAdmin') {
    return {
      items: [],
      source: 'mock',
    };
  }

  try {
    const envelope = await apiClient.getClubApplications(clubId, {
      operatorId,
      status: 'Pending',
      limit: 20,
      offset: 0,
    });
    return {
      items: envelope.items,
      source: 'api',
    };
  } catch (error) {
    return {
      items: readClubApplicationInbox()
        .filter((item) => item.clubId === clubId)
        .map(toApplicationView),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Application inbox fallback to mock.',
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

function renderDashboardPlaceholder(
  title: string,
  path: string,
  payload: DashboardLoadState,
  roleNote: string,
) {
  return `
    <article class="card dashboard-card dashboard-card--pending">
      <div class="public-hall__panel-head">
        <div>
          <h3>${title}</h3>
          <p>接口：${path}</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <p>
        这块数据面板还在等后端 dashboard 数据补齐，当前先保留位置和请求路径，
        避免阻塞“申请 -> 收件箱 -> 审批”的主链路推进。
      </p>
      <p class="public-hall__empty">${roleNote}</p>
    </article>
  `;
}

function renderClubApplicationInbox(payload: ApplicationInboxState, role: Role) {
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

  const pendingCount = payload.items.filter((item) => item.status === 'Pending').length;

  return `
    <article class="card panel-card">
      <div class="public-hall__panel-head">
        <div>
          <h3>入部申请收件箱</h3>
          <p>现在优先读取真实申请队列，接口不可用时才退回到前端暂存收件箱。</p>
        </div>
        <div>
          <span class="source-badge source-badge--${payload.source}">Pending ${pendingCount}</span>
          ${payload.warning ? `<p class="public-hall__warning">${payload.warning}</p>` : ''}
        </div>
      </div>
      <ul class="list">
        ${
          payload.items.length > 0
            ? payload.items
                .map(
                  (item) => `
                    <li class="list-row">
                      <div>
                        <strong>${item.applicant.displayName}</strong>
                        <span>${item.message}</span>
                        <span>${formatDateTime(item.submittedAt)}</span>
                      </div>
                      <div>
                        <span>${item.status}</span>
                        <span>${item.applicant.playerId}</span>
                        ${
                          item.canReview && item.status === 'Pending'
                            ? `
                              <div class="inline-actions">
                                <button type="button" class="portal-refresh" data-action="approve-application" data-application-id="${item.applicationId}">
                                  批准
                                </button>
                                <button type="button" class="portal-refresh" data-action="reject-application" data-application-id="${item.applicationId}">
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
  inboxPayload: ApplicationInboxState,
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
        <h2>成员工作台</h2>
        <p>
          当前成员工作台优先服务主链路：俱乐部管理员查看申请收件箱并执行审批。
          dashboard 相关区块先降级为待接入面板，不阻塞申请流程联调。
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
              <option value="player-registered-1" ${state.playerId === 'player-registered-1' ? 'selected' : ''}>Aoi</option>
              <option value="player-registered-2" ${state.playerId === 'player-registered-2' ? 'selected' : ''}>Mika</option>
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
        ${renderClubApplicationInbox(inboxPayload, activeOperator.role)}
      </div>
      <div class="member-hub__grid">
        ${
          playerPayload.source === 'api' && playerPayload.dashboard
            ? `
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
            `
            : renderDashboardPlaceholder(
                '玩家数据面板',
                `/dashboards/players/${state.playerId}?operatorId=${state.operatorId}`,
                playerPayload,
                '等后端补齐 player dashboard 后，这里会切回真实数据视图。',
              )
        }
        ${
          activeOperator.role === 'ClubAdmin' && clubPayload.source === 'api' && clubPayload.dashboard
            ? `
              <article class="card dashboard-card">
                <div class="public-hall__panel-head">
                  <div>
                    <h3>俱乐部数据面板</h3>
                    <p>接口：/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}</p>
                  </div>
                  ${createSourceBadge(clubPayload.source, clubPayload.warning)}
                </div>
                ${renderMetrics(clubPayload.dashboard)}
              </article>
            `
            : renderDashboardPlaceholder(
                '俱乐部数据面板',
                `/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}`,
                clubPayload,
                activeOperator.role === 'ClubAdmin'
                  ? '等后端补齐 club dashboard 后，这里会切回真实数据视图。'
                  : '当前操作人不是俱乐部管理员，俱乐部管理面板仍然会受角色控制。',
              )
        }
      </div>
    </section>
  `;
}

function renderLoading() {
  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">1. Member Hub</p>
        <h2>成员工作台</h2>
        <p>正在加载玩家、俱乐部和申请收件箱数据。</p>
      </div>
      <div class="card public-hall__loading">Loading member hub...</div>
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

    const [playerPayload, clubPayload, inboxPayload] = await Promise.all([
      loadPlayerDashboard(state.playerId, state.operatorId),
      loadClubDashboard(state.clubId, state.operatorId),
      loadClubApplicationInbox(state.clubId, state.operatorId, activeOperator.role),
    ]);

    container.innerHTML = renderMemberHubLayout(state, playerPayload, clubPayload, inboxPayload);
    bindEvents();
  }

  function bindEvents() {
    container
      .querySelector<HTMLSelectElement>('[data-filter="member-operator"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        state.operatorId = target.value;
        const activeOperator =
          mockOperators.find((operator) => operator.id === state.operatorId) ?? mockOperators[0];
        state.playerId = activeOperator.playerId;
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
        button.addEventListener('click', async () => {
          const applicationId = button.dataset.applicationId;
          if (!applicationId) {
            return;
          }
          try {
            await apiClient.reviewClubApplication(state.clubId, applicationId, {
              operatorId: state.operatorId,
              decision: 'approve',
              note: 'approved from member hub',
            });
          } catch {
            updateClubApplicationInboxStatus(applicationId, 'Approved');
          }
          void render();
        });
      });

    container
      .querySelectorAll<HTMLButtonElement>('[data-action="reject-application"]')
      .forEach((button) => {
        button.addEventListener('click', async () => {
          const applicationId = button.dataset.applicationId;
          if (!applicationId) {
            return;
          }
          try {
            await apiClient.reviewClubApplication(state.clubId, applicationId, {
              operatorId: state.operatorId,
              decision: 'reject',
              note: 'rejected from member hub',
            });
          } catch {
            updateClubApplicationInboxStatus(applicationId, 'Rejected');
          }
          void render();
        });
      });
  }

  await render();
}
