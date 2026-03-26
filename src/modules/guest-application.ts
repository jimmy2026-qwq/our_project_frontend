import {
  apiClient,
  type ClubApplicationPayload,
  type CreateGuestSessionPayload,
  type WithdrawClubApplicationPayload,
} from '../api/client';
import type { ClubApplication, ClubSummary, GuestSession } from '../domain/models';
import { mockClubs } from '../mocks/overview';

type DataSource = 'api' | 'mock';

interface SessionState {
  session: GuestSession | null;
  source?: DataSource;
  warning?: string;
}

interface ApplicationState {
  application: ClubApplication | null;
  source?: DataSource;
  warning?: string;
}

interface GuestApplicationState {
  clubId: string;
  displayName: string;
  message: string;
  withdrawNote: string;
  session: SessionState;
  application: ApplicationState;
}

const mockSessions = new Map<string, GuestSession>();
const mockApplications = new Map<string, ClubApplication>();

const DEFAULT_STATE: GuestApplicationState = {
  clubId: mockClubs[0]?.id ?? 'club-1',
  displayName: 'AnonymousFan',
  message: 'I would like to join as a visitor first.',
  withdrawNote: 'schedule changed',
  session: {
    session: null,
  },
  application: {
    application: null,
  },
};

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

function getClubName(clubId: string) {
  return mockClubs.find((club) => club.id === clubId)?.name ?? clubId;
}

function createMockGuestSession(payload: CreateGuestSessionPayload): GuestSession {
  const session: GuestSession = {
    id: `guest-${Date.now()}`,
    displayName: payload.displayName,
    createdAt: new Date().toISOString(),
  };
  mockSessions.set(session.id, session);
  return session;
}

function createMockClubApplication(clubId: string, payload: ClubApplicationPayload): ClubApplication {
  const session = payload.guestSessionId ? mockSessions.get(payload.guestSessionId) : null;
  const application: ClubApplication = {
    id: `membership-${Date.now()}`,
    clubId,
    status: 'Pending',
    applicantName: session?.displayName ?? payload.displayName ?? 'Guest',
    message: payload.message,
    createdAt: new Date().toISOString(),
    guestSessionId: payload.guestSessionId,
  };
  mockApplications.set(application.id, application);
  return application;
}

function withdrawMockClubApplication(
  membershipId: string,
  payload: WithdrawClubApplicationPayload,
): ClubApplication {
  const existing = mockApplications.get(membershipId);

  if (!existing) {
    throw new Error('Mock application not found.');
  }

  const updated: ClubApplication = {
    ...existing,
    status: 'Withdrawn',
    message: payload.note ? `${existing.message} / Withdraw note: ${payload.note}` : existing.message,
  };

  mockApplications.set(membershipId, updated);
  return updated;
}

function renderSessionCard(state: GuestApplicationState) {
  const session = state.session.session;

  return `
    <article class="card panel-card guest-flow-card">
      <div class="public-hall__panel-head">
        <div>
          <p class="eyebrow">Step 1</p>
          <h3>创建匿名会话</h3>
          <p>先调用 <code>POST /guest-sessions</code>，为未登录访客生成一次匿名提交所需的临时标识。</p>
        </div>
        ${createSourceBadge(state.session.source, state.session.warning)}
      </div>
      <div class="guest-flow__form">
        <label>
          <span>Display Name</span>
          <input data-guest-field="displayName" value="${state.displayName}" placeholder="AnonymousFan" />
        </label>
        <button type="button" class="portal-refresh" data-action="create-guest-session">
          创建匿名会话
        </button>
      </div>
      ${
        session
          ? `
            <div class="guest-flow__result">
              <strong>${session.displayName}</strong>
              <span>guestSessionId: ${session.id}</span>
              <span>创建时间：${formatDateTime(session.createdAt)}</span>
            </div>
          `
          : '<p class="public-hall__empty">当前还没有创建匿名会话。</p>'
      }
    </article>
  `;
}

function renderApplicationCard(state: GuestApplicationState) {
  const application = state.application.application;
  const clubOptions = mockClubs
    .map(
      (club: ClubSummary) =>
        `<option value="${club.id}" ${club.id === state.clubId ? 'selected' : ''}>${club.name}</option>`,
    )
    .join('');

  return `
    <article class="card panel-card guest-flow-card">
      <div class="public-hall__panel-head">
        <div>
          <p class="eyebrow">Step 2</p>
          <h3>提交匿名俱乐部申请</h3>
          <p>使用 <code>POST /clubs/:clubId/applications</code> 提交公开区匿名申请，匿名会话只用于后端识别同一提交者。</p>
        </div>
        ${createSourceBadge(state.application.source, state.application.warning)}
      </div>
      <div class="guest-flow__form">
        <label>
          <span>Club</span>
          <select data-guest-field="clubId">${clubOptions}</select>
        </label>
        <label>
          <span>Message</span>
          <textarea data-guest-field="message" rows="4">${state.message}</textarea>
        </label>
        <button
          type="button"
          class="portal-refresh"
          data-action="submit-club-application"
          ${state.session.session ? '' : 'disabled'}
        >
          提交申请
        </button>
      </div>
      ${
        application
          ? `
            <div class="guest-flow__result">
              <strong>${application.applicantName} -> ${getClubName(application.clubId)}</strong>
              <span>membershipId: ${application.id}</span>
              <span>状态：${application.status}</span>
              <span>提交时间：${formatDateTime(application.createdAt)}</span>
              <span>留言：${application.message}</span>
            </div>
          `
          : '<p class="public-hall__empty">还没有提交申请。创建匿名会话后即可直接尝试。</p>'
      }
    </article>
  `;
}

function renderWithdrawCard(state: GuestApplicationState) {
  const application = state.application.application;

  return `
    <article class="card panel-card guest-flow-card">
      <div class="public-hall__panel-head">
        <div>
          <p class="eyebrow">Step 3</p>
          <h3>撤回未处理申请</h3>
          <p>如果申请仍是待处理状态，可调用 <code>POST /clubs/:clubId/applications/:membershipId/withdraw</code> 撤回。</p>
        </div>
      </div>
      <div class="guest-flow__form">
        <label>
          <span>撤回说明</span>
          <input data-guest-field="withdrawNote" value="${state.withdrawNote}" placeholder="schedule changed" />
        </label>
        <button
          type="button"
          class="portal-refresh"
          data-action="withdraw-club-application"
          ${application && application.status === 'Pending' ? '' : 'disabled'}
        >
          撤回申请
        </button>
      </div>
      ${
        application
          ? `
            <div class="guest-flow__result guest-flow__result--muted">
              <span>当前申请：${application.id}</span>
              <span>当前状态：${application.status}</span>
            </div>
          `
          : '<p class="public-hall__empty">没有可撤回的申请。</p>'
      }
    </article>
  `;
}

function renderGuestApplicationHub(state: GuestApplicationState) {
  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">Guest Flow</p>
        <h2>公开区匿名入会申请</h2>
        <p>
          这是公开大厅里的一个无权限表单入口，不代表 Guest 拥有任何业务权限。
          前端只是为未登录访客提供匿名申请入口，后端再通过 guest session 追踪同一提交者。
        </p>
      </div>
      <div class="guest-flow__summary card">
        <div>
          <strong>已对接接口</strong>
          <span>POST /guest-sessions</span>
          <span>POST /clubs/:clubId/applications</span>
          <span>POST /clubs/:clubId/applications/:membershipId/withdraw</span>
        </div>
        <div>
          <strong>边界说明</strong>
          <span>Guest 仍然是公开只读身份，这里只是匿名提交入口，不进入 RBAC。</span>
        </div>
      </div>
      <div class="guest-flow__grid">
        ${renderSessionCard(state)}
        ${renderApplicationCard(state)}
        ${renderWithdrawCard(state)}
      </div>
    </section>
  `;
}

export async function initGuestApplicationHub(container: HTMLElement) {
  const state: GuestApplicationState = structuredClone(DEFAULT_STATE);

  function bindEvents() {
    container
      .querySelector<HTMLInputElement>('[data-guest-field="displayName"]')
      ?.addEventListener('input', (event) => {
        state.displayName = (event.currentTarget as HTMLInputElement).value;
      });

    container
      .querySelector<HTMLSelectElement>('[data-guest-field="clubId"]')
      ?.addEventListener('change', (event) => {
        state.clubId = (event.currentTarget as HTMLSelectElement).value;
      });

    container
      .querySelector<HTMLTextAreaElement>('[data-guest-field="message"]')
      ?.addEventListener('input', (event) => {
        state.message = (event.currentTarget as HTMLTextAreaElement).value;
      });

    container
      .querySelector<HTMLInputElement>('[data-guest-field="withdrawNote"]')
      ?.addEventListener('input', (event) => {
        state.withdrawNote = (event.currentTarget as HTMLInputElement).value;
      });

    container
      .querySelector<HTMLButtonElement>('[data-action="create-guest-session"]')
      ?.addEventListener('click', async () => {
        try {
          const session = await apiClient.createGuestSession({
            displayName: state.displayName.trim() || 'AnonymousFan',
          });
          state.session = { session, source: 'api' };
        } catch (error) {
          const session = createMockGuestSession({
            displayName: state.displayName.trim() || 'AnonymousFan',
          });
          state.session = {
            session,
            source: 'mock',
            warning: error instanceof Error ? error.message : 'Guest session fallback to mock.',
          };
        }

        container.innerHTML = renderGuestApplicationHub(state);
        bindEvents();
      });

    container
      .querySelector<HTMLButtonElement>('[data-action="submit-club-application"]')
      ?.addEventListener('click', async () => {
        const sessionId = state.session.session?.id;

        if (!sessionId) {
          return;
        }

        try {
          const application = await apiClient.submitClubApplication(state.clubId, {
            guestSessionId: sessionId,
            displayName: state.displayName.trim(),
            message: state.message.trim() || 'I would like to join as a visitor first.',
          });
          state.application = { application, source: 'api' };
        } catch (error) {
          const application = createMockClubApplication(state.clubId, {
            guestSessionId: sessionId,
            displayName: state.displayName.trim(),
            message: state.message.trim() || 'I would like to join as a visitor first.',
          });
          state.application = {
            application,
            source: 'mock',
            warning: error instanceof Error ? error.message : 'Club application fallback to mock.',
          };
        }

        container.innerHTML = renderGuestApplicationHub(state);
        bindEvents();
      });

    container
      .querySelector<HTMLButtonElement>('[data-action="withdraw-club-application"]')
      ?.addEventListener('click', async () => {
        const sessionId = state.session.session?.id;
        const applicationId = state.application.application?.id;

        if (!sessionId || !applicationId) {
          return;
        }

        try {
          const application = await apiClient.withdrawClubApplication(state.clubId, applicationId, {
            guestSessionId: sessionId,
            note: state.withdrawNote.trim(),
          });
          state.application = { application, source: 'api' };
        } catch (error) {
          const application = withdrawMockClubApplication(applicationId, {
            guestSessionId: sessionId,
            note: state.withdrawNote.trim(),
          });
          state.application = {
            application,
            source: 'mock',
            warning: error instanceof Error ? error.message : 'Withdraw application fallback to mock.',
          };
        }

        container.innerHTML = renderGuestApplicationHub(state);
        bindEvents();
      });
  }

  container.innerHTML = renderGuestApplicationHub(state);
  bindEvents();
}
