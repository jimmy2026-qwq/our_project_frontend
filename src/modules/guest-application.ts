import { apiClient } from '../api/client';
import type { ClubApplication, ClubSummary, PlayerProfile } from '../domain/models';
import {
  readClubApplicationsByOperator,
  updateClubApplicationInboxStatus,
  upsertClubApplicationInboxItem,
} from '../lib/club-applications';
import { mockClubs } from '../mocks/overview';

type DataSource = 'api' | 'mock';

interface RegisteredPlayerOption {
  operatorId: string;
  nickname: string;
  note: string;
}

interface ClubDirectoryState {
  items: ClubSummary[];
  source: DataSource;
  warning?: string;
}

interface PlayerContextState {
  player: PlayerProfile | null;
  source?: DataSource;
  warning?: string;
}

interface ApplicationState {
  application: ClubApplication | null;
  source?: DataSource;
  warning?: string;
}

interface HomeClubApplicationState {
  operatorId: string;
  clubId: string;
  message: string;
  withdrawNote: string;
  clubs: ClubDirectoryState;
  playerContext: PlayerContextState;
  application: ApplicationState;
}

const playerOptions: RegisteredPlayerOption[] = [
  {
    operatorId: 'player-registered-1',
    nickname: 'Aoi',
    note: '当前用预置注册玩家代替真实注册流程',
  },
  {
    operatorId: 'player-registered-2',
    nickname: 'Mika',
    note: '后续可替换为真实登录后的当前用户',
  },
];

const mockApplications = new Map<string, ClubApplication>();

function createSourceBadge(source?: DataSource, warning?: string) {
  if (!source) {
    return '';
  }

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

function createMockClubApplication(
  clubId: string,
  operatorId: string,
  applicantName: string,
  message: string,
): ClubApplication {
  const application: ClubApplication = {
    id: `membership-${Date.now()}`,
    clubId,
    status: 'Pending',
    applicantName,
    message,
    createdAt: new Date().toISOString(),
  };
  mockApplications.set(`${clubId}:${operatorId}`, application);
  return application;
}

function withdrawMockClubApplication(clubId: string, operatorId: string) {
  const key = `${clubId}:${operatorId}`;
  const existing = mockApplications.get(key);

  if (!existing) {
    throw new Error('Mock application not found.');
  }

  const updated: ClubApplication = {
    ...existing,
    status: 'Withdrawn',
  };
  mockApplications.set(key, updated);
  return updated;
}

function getFallbackPlayer(operatorId: string) {
  return playerOptions.find((item) => item.operatorId === operatorId) ?? playerOptions[0];
}

function getSelectedClubName(clubId: string, clubs: ClubSummary[]) {
  return clubs.find((club) => club.id === clubId)?.name ?? clubId;
}

async function loadJoinableClubs(): Promise<ClubDirectoryState> {
  try {
    const envelope = await apiClient.getClubs({
      activeOnly: true,
      joinableOnly: true,
      limit: 20,
      offset: 0,
    });
    return {
      items: envelope.items,
      source: 'api',
    };
  } catch (error) {
    return {
      items: mockClubs,
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Club directory fallback to mock.',
    };
  }
}

async function loadPlayerContext(operatorId: string): Promise<PlayerContextState> {
  try {
    const player = await apiClient.getCurrentPlayer(operatorId);
    return {
      player,
      source: 'api',
    };
  } catch (error) {
    return {
      player: {
        playerId: operatorId,
        displayName: getFallbackPlayer(operatorId).nickname,
      },
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Current player fallback to mock.',
    };
  }
}

function renderHomeClubApplication(state: HomeClubApplicationState) {
  const playerOptionsMarkup = playerOptions
    .map(
      (player) =>
        `<option value="${player.operatorId}" ${player.operatorId === state.operatorId ? 'selected' : ''}>${player.nickname}</option>`,
    )
    .join('');

  const clubOptionsMarkup = state.clubs.items
    .map(
      (club) => `<option value="${club.id}" ${club.id === state.clubId ? 'selected' : ''}>${club.name}</option>`,
    )
    .join('');

  const fallbackPlayer = getFallbackPlayer(state.operatorId);
  const selectedPlayerName = state.playerContext.player?.displayName ?? fallbackPlayer.nickname;
  const application = state.application.application;
  const myApplications = readClubApplicationsByOperator(state.operatorId).slice(0, 3);

  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">Club Application</p>
        <h2>主页申请工作台</h2>
        <p>
          主链路现在按新 contract 优先走后端：注册玩家选择身份、选择可申请俱乐部、提交申请，
          然后由 Club Admin 在成员工作台里查看并审批。
        </p>
      </div>
      <article class="card public-join-card">
        <div class="public-hall__panel-head">
          <div>
            <h3>注册玩家申请俱乐部</h3>
            <p>
              当前调用链路是 <code>POST /clubs/:clubId/applications</code>，通过 <code>operatorId</code>
              代表已注册玩家发起申请。
            </p>
          </div>
          ${createSourceBadge(
            state.application.source ?? state.playerContext.source ?? state.clubs.source,
            state.application.warning ?? state.playerContext.warning ?? state.clubs.warning,
          )}
        </div>
        <div class="public-join-card__callout">
          <strong>当前状态</strong>
          <span>
            俱乐部列表优先读取 <code>joinableOnly</code>，玩家展示名优先读取 <code>/players/me</code>。
            如果接口暂时不可用，页面仍然会退回到 mock 兜底。
          </span>
        </div>
        <div class="guest-flow__form">
          <label>
            <span>当前注册玩家</span>
            <select data-home-application="operatorId">${playerOptionsMarkup}</select>
          </label>
          <label>
            <span>目标俱乐部</span>
            <select data-home-application="clubId">${clubOptionsMarkup}</select>
          </label>
          <label>
            <span>申请留言</span>
            <textarea data-home-application="message" rows="4">${state.message}</textarea>
          </label>
        </div>
        <div class="public-join-card__actions">
          <button type="button" class="portal-refresh" data-action="submit-home-club-application">
            以注册玩家身份提交申请
          </button>
          <button
            type="button"
            class="portal-refresh"
            data-action="withdraw-home-club-application"
            ${application && application.status === 'Pending' ? '' : 'disabled'}
          >
            撤回申请
          </button>
        </div>
        ${
          application
            ? `
              <div class="guest-flow__result">
                <strong>${selectedPlayerName} -> ${getSelectedClubName(application.clubId, state.clubs.items)}</strong>
                <span>状态：${application.status}</span>
                <span>申请编号：${application.id}</span>
                <span>提交时间：${formatDateTime(application.createdAt)}</span>
                <span>留言：${application.message}</span>
              </div>
            `
            : `
              <div class="guest-flow__result guest-flow__result--muted">
                <span>当前玩家：${selectedPlayerName}</span>
                <span>${fallbackPlayer.note}</span>
                <span>提交后即可在 Member Hub 中用 Club Admin 身份查看收件箱与审批动作。</span>
              </div>
            `
        }
      </article>
      <article class="card panel-card">
        <div class="public-hall__panel-head">
          <div>
            <h3>我的申请状态</h3>
            <p>这里优先展示当前注册玩家最近提交的申请，方便从玩家视角确认主链路是否已经走通。</p>
          </div>
        </div>
        <ul class="list">
          ${
            myApplications.length > 0
              ? myApplications
                  .map(
                    (item) => `
                      <li class="list-row">
                        <div>
                          <strong>${item.clubName}</strong>
                          <span>${item.message}</span>
                        </div>
                        <div>
                          <span>${item.status}</span>
                          <span>${formatDateTime(item.submittedAt)}</span>
                        </div>
                      </li>
                    `,
                  )
                  .join('')
              : '<li class="list-row public-hall__empty">当前注册玩家还没有申请记录。</li>'
          }
        </ul>
      </article>
    </section>
  `;
}

export async function initHomeClubApplication(container: HTMLElement) {
  const initialClubs = await loadJoinableClubs();
  const initialOperatorId = playerOptions[0].operatorId;

  const state: HomeClubApplicationState = {
    operatorId: initialOperatorId,
    clubId: initialClubs.items[0]?.id ?? mockClubs[0]?.id ?? 'club-1',
    message: 'I would like to join next split.',
    withdrawNote: 'schedule changed',
    clubs: initialClubs,
    playerContext: await loadPlayerContext(initialOperatorId),
    application: { application: null },
  };

  async function rerender() {
    container.innerHTML = renderHomeClubApplication(state);
    bindEvents();
  }

  function bindEvents() {
    container
      .querySelector<HTMLSelectElement>('[data-home-application="operatorId"]')
      ?.addEventListener('change', async (event) => {
        state.operatorId = (event.currentTarget as HTMLSelectElement).value;
        state.playerContext = await loadPlayerContext(state.operatorId);
        await rerender();
      });

    container
      .querySelector<HTMLSelectElement>('[data-home-application="clubId"]')
      ?.addEventListener('change', (event) => {
        state.clubId = (event.currentTarget as HTMLSelectElement).value;
      });

    container
      .querySelector<HTMLTextAreaElement>('[data-home-application="message"]')
      ?.addEventListener('input', (event) => {
        state.message = (event.currentTarget as HTMLTextAreaElement).value;
      });

    container
      .querySelector<HTMLButtonElement>('[data-action="submit-home-club-application"]')
      ?.addEventListener('click', async () => {
        const selectedPlayerName =
          state.playerContext.player?.displayName ?? getFallbackPlayer(state.operatorId).nickname;
        const message = state.message.trim() || 'I would like to join next split.';

        try {
          const application = await apiClient.submitClubApplication(state.clubId, {
            operatorId: state.operatorId,
            message,
          });
          state.application = { application, source: 'api' };
          upsertClubApplicationInboxItem({
            id: application.id,
            clubId: state.clubId,
            clubName: getSelectedClubName(state.clubId, state.clubs.items),
            operatorId: state.operatorId,
            applicantName: selectedPlayerName,
            message: application.message,
            status: application.status,
            submittedAt: application.createdAt,
            source: 'api',
          });
        } catch (error) {
          const application = createMockClubApplication(
            state.clubId,
            state.operatorId,
            selectedPlayerName,
            message,
          );
          state.application = {
            application,
            source: 'mock',
            warning: error instanceof Error ? error.message : 'Club application fallback to mock.',
          };
          upsertClubApplicationInboxItem({
            id: application.id,
            clubId: state.clubId,
            clubName: getSelectedClubName(state.clubId, state.clubs.items),
            operatorId: state.operatorId,
            applicantName: selectedPlayerName,
            message: application.message,
            status: application.status,
            submittedAt: application.createdAt,
            source: 'mock',
          });
        }

        await rerender();
      });

    container
      .querySelector<HTMLButtonElement>('[data-action="withdraw-home-club-application"]')
      ?.addEventListener('click', async () => {
        const applicationId = state.application.application?.id;

        if (!applicationId) {
          return;
        }

        try {
          const application = await apiClient.withdrawClubApplication(state.clubId, applicationId, {
            operatorId: state.operatorId,
            note: state.withdrawNote,
          });
          state.application = { application, source: 'api' };
          updateClubApplicationInboxStatus(application.id, application.status);
        } catch (error) {
          const application = withdrawMockClubApplication(state.clubId, state.operatorId);
          state.application = {
            application,
            source: 'mock',
            warning: error instanceof Error ? error.message : 'Withdraw request fallback to mock.',
          };
          updateClubApplicationInboxStatus(application.id, application.status);
        }

        await rerender();
      });
  }

  await rerender();
}
