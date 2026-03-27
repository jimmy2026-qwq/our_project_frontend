import { apiClient } from '../api/client';
import type { ClubApplication } from '../domain/models';
import {
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

function getSelectedPlayer(operatorId: string) {
  return playerOptions.find((item) => item.operatorId === operatorId) ?? playerOptions[0];
}

function getSelectedClubName(clubId: string) {
  return mockClubs.find((club) => club.id === clubId)?.name ?? clubId;
}

function renderHomeClubApplication(state: HomeClubApplicationState) {
  const playerOptionsMarkup = playerOptions
    .map(
      (player) =>
        `<option value="${player.operatorId}" ${player.operatorId === state.operatorId ? 'selected' : ''}>${player.nickname}</option>`,
    )
    .join('');

  const clubOptionsMarkup = mockClubs
    .map(
      (club) => `<option value="${club.id}" ${club.id === state.clubId ? 'selected' : ''}>${club.name}</option>`,
    )
    .join('');

  const selectedPlayer = getSelectedPlayer(state.operatorId);
  const application = state.application.application;

  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">Club Application</p>
        <h2>主页申请工作台</h2>
        <p>
          根据当前规则，只有注册玩家才能申请加入俱乐部。由于注册功能还没做，
          这里先把申请能力放在主页上，用预置注册玩家身份模拟真实用户，便于继续往后端流程推进。
        </p>
      </div>
      <article class="card public-join-card">
        <div class="public-hall__panel-head">
          <div>
            <h3>注册玩家申请俱乐部</h3>
            <p>
              当前调用链路是 <code>POST /clubs/:clubId/applications</code>，通过 <code>operatorId</code>
              代表已注册玩家发起申请，不再使用匿名会话。
            </p>
          </div>
          ${createSourceBadge(state.application.source, state.application.warning)}
        </div>
        <div class="public-join-card__callout">
          <strong>当前过渡方案</strong>
          <span>
            真实产品里这里应该来自注册与登录后的当前用户；现在先用预置注册玩家继续打通申请链路，
            等注册功能上线后再把这个主页工作台替换成真实入口。
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
                <strong>${selectedPlayer.nickname} -> ${getSelectedClubName(application.clubId)}</strong>
                <span>状态：${application.status}</span>
                <span>申请编号：${application.id}</span>
                <span>提交时间：${formatDateTime(application.createdAt)}</span>
                <span>留言：${application.message}</span>
              </div>
            `
            : `
              <div class="guest-flow__result guest-flow__result--muted">
                <span>当前模拟玩家：${selectedPlayer.nickname}</span>
                <span>${selectedPlayer.note}</span>
                <span>提交后即可继续联调俱乐部管理员审批流。</span>
              </div>
            `
        }
      </article>
    </section>
  `;
}

export async function initHomeClubApplication(container: HTMLElement) {
  const state: HomeClubApplicationState = {
    operatorId: playerOptions[0].operatorId,
    clubId: mockClubs[0]?.id ?? 'club-1',
    message: 'I would like to join next split.',
    withdrawNote: 'schedule changed',
    application: { application: null },
  };

  function bindEvents() {
    container
      .querySelector<HTMLSelectElement>('[data-home-application="operatorId"]')
      ?.addEventListener('change', (event) => {
        state.operatorId = (event.currentTarget as HTMLSelectElement).value;
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
        const selectedPlayer = getSelectedPlayer(state.operatorId);
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
            clubName: getSelectedClubName(state.clubId),
            operatorId: state.operatorId,
            applicantName: selectedPlayer.nickname,
            message: application.message,
            status: application.status,
            submittedAt: application.createdAt,
            source: 'api',
          });
        } catch (error) {
          const application = createMockClubApplication(
            state.clubId,
            state.operatorId,
            selectedPlayer.nickname,
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
            clubName: getSelectedClubName(state.clubId),
            operatorId: state.operatorId,
            applicantName: selectedPlayer.nickname,
            message: application.message,
            status: application.status,
            submittedAt: application.createdAt,
            source: 'mock',
          });
        }

        container.innerHTML = renderHomeClubApplication(state);
        bindEvents();
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

        container.innerHTML = renderHomeClubApplication(state);
        bindEvents();
      });
  }

  container.innerHTML = renderHomeClubApplication(state);
  bindEvents();
}
