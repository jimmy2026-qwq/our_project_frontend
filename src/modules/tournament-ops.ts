import { apiClient } from '../api/client';
import type {
  AppealSummary,
  ListEnvelope,
  MatchRecordSummary,
  TableStatus,
  TournamentTableSummary,
} from '../domain/models';
import { mockAppeals, mockRecords, mockTournamentTables, toMockEnvelope } from '../mocks/overview';

type DataSource = 'api' | 'mock';

interface LoadState<T> {
  envelope: ListEnvelope<T>;
  source: DataSource;
  warning?: string;
}

interface StageContext {
  id: string;
  name: string;
}

interface TournamentContext {
  id: string;
  name: string;
  stages: StageContext[];
}

interface TournamentOpsState {
  tournamentId: string;
  stageId: string;
  tableStatus: TableStatus | '';
  playerId: string;
  appealStatus: AppealSummary['status'] | '';
}

const tournamentContexts: TournamentContext[] = [
  {
    id: 'tournament-123',
    name: 'Riichi Nexus Spring Masters',
    stages: [
      { id: 'stage-swiss-1', name: 'Swiss Round 1' },
      { id: 'stage-finals', name: 'Finals' },
    ],
  },
  {
    id: 'tournament-456',
    name: 'Kanto Club Open',
    stages: [{ id: 'stage-qualifier-a', name: 'Qualifier A' }],
  },
];

const DEFAULT_STATE: TournamentOpsState = {
  tournamentId: tournamentContexts[0].id,
  stageId: tournamentContexts[0].stages[0].id,
  tableStatus: '',
  playerId: '',
  appealStatus: '',
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

async function loadTables(
  state: TournamentOpsState,
): Promise<LoadState<TournamentTableSummary>> {
  try {
    const envelope = await apiClient.getTournamentTables(state.tournamentId, state.stageId, {
      status: state.tableStatus || undefined,
      playerId: state.playerId || undefined,
      limit: 10,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    const filtered = mockTournamentTables.filter((table) => {
      const stageMatch = table.stageId === state.stageId;
      const statusMatch = !state.tableStatus || table.status === state.tableStatus;
      const playerMatch = !state.playerId || table.playerIds.includes(state.playerId);
      return stageMatch && statusMatch && playerMatch;
    });

    return {
      envelope: toMockEnvelope(filtered, {
        tournamentId: state.tournamentId,
        stageId: state.stageId,
        status: state.tableStatus,
        playerId: state.playerId,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Tournament tables fallback to mock.',
    };
  }
}

async function loadRecords(
  state: TournamentOpsState,
): Promise<LoadState<MatchRecordSummary>> {
  try {
    const envelope = await apiClient.getRecords({
      tournamentId: state.tournamentId,
      stageId: state.stageId,
      playerId: state.playerId || undefined,
      limit: 10,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    const filtered = mockRecords.filter((record) => {
      const tournamentMatch = record.tournamentId === state.tournamentId;
      const stageMatch = record.stageId === state.stageId;
      const playerMatch = !state.playerId || record.summary.includes(state.playerId);
      return tournamentMatch && stageMatch && playerMatch;
    });

    return {
      envelope: toMockEnvelope(filtered, {
        tournamentId: state.tournamentId,
        stageId: state.stageId,
        playerId: state.playerId,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Records fallback to mock.',
    };
  }
}

async function loadAppeals(
  state: TournamentOpsState,
): Promise<LoadState<AppealSummary>> {
  try {
    const envelope = await apiClient.getAppeals({
      tournamentId: state.tournamentId,
      status: state.appealStatus || undefined,
      limit: 10,
      offset: 0,
    });

    return { envelope, source: 'api' };
  } catch (error) {
    const filtered = mockAppeals.filter((appeal) => {
      const tournamentMatch = appeal.tournamentId === state.tournamentId;
      const statusMatch = !state.appealStatus || appeal.status === state.appealStatus;
      return tournamentMatch && statusMatch;
    });

    return {
      envelope: toMockEnvelope(filtered, {
        tournamentId: state.tournamentId,
        status: state.appealStatus,
      }),
      source: 'mock',
      warning: error instanceof Error ? error.message : 'Appeals fallback to mock.',
    };
  }
}

function renderTables(payload: LoadState<TournamentTableSummary>) {
  const items =
    payload.envelope.items.length > 0
      ? payload.envelope.items
          .map(
            (table) => `
              <li class="list-row">
                <div>
                  <strong>${table.tableCode}</strong>
                  <span>${table.id}</span>
                </div>
                <div>
                  <span>${table.status}</span>
                  <span>${table.seatCount} seats</span>
                </div>
              </li>
            `,
          )
          .join('')
      : '<li class="list-row public-hall__empty">当前过滤条件下没有对局桌。</li>';

  return `
    <article class="card panel-card">
      <div class="public-hall__panel-head">
        <div>
          <h3>对局桌调度池</h3>
          <p>赛事管理员最常用的状态查看入口，对应 tables 查询。</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <ul class="list">${items}</ul>
    </article>
  `;
}

function renderRecords(payload: LoadState<MatchRecordSummary>) {
  const items =
    payload.envelope.items.length > 0
      ? payload.envelope.items
          .map(
            (record) => `
              <li class="list-row">
                <div>
                  <strong>${record.id}</strong>
                  <span>${record.tableId}</span>
                </div>
                <div>
                  <span>${formatDateTime(record.recordedAt)}</span>
                  <span>${record.summary}</span>
                </div>
              </li>
            `,
          )
          .join('')
      : '<li class="list-row public-hall__empty">当前没有符合条件的对局记录。</li>';

  return `
    <article class="card panel-card">
      <div class="public-hall__panel-head">
        <div>
          <h3>对局记录</h3>
          <p>用于串联牌谱、积分轨迹和赛后归档检查。</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <ul class="list">${items}</ul>
    </article>
  `;
}

function renderAppeals(payload: LoadState<AppealSummary>) {
  const items =
    payload.envelope.items.length > 0
      ? payload.envelope.items
          .map(
            (appeal) => `
              <li class="list-row">
                <div>
                  <strong>${appeal.id}</strong>
                  <span>${appeal.tableId}</span>
                </div>
                <div>
                  <span>${appeal.status}</span>
                  <span>${appeal.verdict}</span>
                </div>
              </li>
            `,
          )
          .join('')
      : '<li class="list-row public-hall__empty">当前没有申诉工单。</li>';

  return `
    <article class="card panel-card">
      <div class="public-hall__panel-head">
        <div>
          <h3>申诉工单</h3>
          <p>围绕异常桌号与裁决流转的处理入口，对应 appeals 查询。</p>
        </div>
        ${createSourceBadge(payload.source, payload.warning)}
      </div>
      <ul class="list">${items}</ul>
    </article>
  `;
}

function renderMissingApiNotes() {
  return `
    <article class="card tournament-ops__note">
      <h3>建议继续向后端索要的接口</h3>
      <p>当前工作台已经能联调 tables / records / appeals，但还缺少赛事运营入口元数据。</p>
      <ul class="list">
        <li class="list-row">
          <div>
            <strong>GET /tournaments</strong>
            <span>用于赛事管理员查看自己可管理的赛事列表。</span>
          </div>
        </li>
        <li class="list-row">
          <div>
            <strong>GET /tournaments/:id/stages</strong>
            <span>用于按赛事动态加载赛段，而不是前端写死 stage 选项。</span>
          </div>
        </li>
        <li class="list-row">
          <div>
            <strong>GET /operators/:id/permissions</strong>
            <span>用于真实登录态后驱动赛事管理员权限与按钮显隐。</span>
          </div>
        </li>
      </ul>
    </article>
  `;
}

function renderLayout(
  state: TournamentOpsState,
  tables: LoadState<TournamentTableSummary>,
  records: LoadState<MatchRecordSummary>,
  appeals: LoadState<AppealSummary>,
) {
  const activeTournament =
    tournamentContexts.find((tournament) => tournament.id === state.tournamentId) ?? tournamentContexts[0];

  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">2. Tournament Ops</p>
        <h2>第三步：赛事管理员工作台</h2>
        <p>
          这里先把赛段上下文、桌况查询、记录查询和申诉入口串起来。
          等后端补齐赛事元数据接口后，这里可以无缝切到真实的多赛事后台。
        </p>
      </div>
      <div class="card tournament-ops__controls">
        <div class="public-hall__filters-head">
          <h3>赛事上下文</h3>
          <button type="button" data-action="reload-tournament-ops">刷新工作台</button>
        </div>
        <div class="public-hall__toolbar">
          <label>
            <span>赛事</span>
            <select data-filter="ops-tournament">
              ${tournamentContexts
                .map(
                  (tournament) => `
                    <option value="${tournament.id}" ${tournament.id === state.tournamentId ? 'selected' : ''}>
                      ${tournament.name}
                    </option>
                  `,
                )
                .join('')}
            </select>
          </label>
          <label>
            <span>赛段</span>
            <select data-filter="ops-stage">
              ${activeTournament.stages
                .map(
                  (stage) => `
                    <option value="${stage.id}" ${stage.id === state.stageId ? 'selected' : ''}>
                      ${stage.name}
                    </option>
                  `,
                )
                .join('')}
            </select>
          </label>
          <label>
            <span>桌状态</span>
            <select data-filter="ops-table-status">
              <option value="" ${state.tableStatus === '' ? 'selected' : ''}>全部</option>
              <option value="WaitingPreparation" ${state.tableStatus === 'WaitingPreparation' ? 'selected' : ''}>WaitingPreparation</option>
              <option value="InProgress" ${state.tableStatus === 'InProgress' ? 'selected' : ''}>InProgress</option>
              <option value="Scoring" ${state.tableStatus === 'Scoring' ? 'selected' : ''}>Scoring</option>
              <option value="Archived" ${state.tableStatus === 'Archived' ? 'selected' : ''}>Archived</option>
              <option value="AppealPending" ${state.tableStatus === 'AppealPending' ? 'selected' : ''}>AppealPending</option>
            </select>
          </label>
          <label>
            <span>玩家 ID</span>
            <input data-filter="ops-player-id" value="${state.playerId}" placeholder="player-123" />
          </label>
          <label>
            <span>申诉状态</span>
            <select data-filter="ops-appeal-status">
              <option value="" ${state.appealStatus === '' ? 'selected' : ''}>全部</option>
              <option value="Open" ${state.appealStatus === 'Open' ? 'selected' : ''}>Open</option>
              <option value="Resolved" ${state.appealStatus === 'Resolved' ? 'selected' : ''}>Resolved</option>
              <option value="Rejected" ${state.appealStatus === 'Rejected' ? 'selected' : ''}>Rejected</option>
              <option value="Escalated" ${state.appealStatus === 'Escalated' ? 'selected' : ''}>Escalated</option>
            </select>
          </label>
        </div>
      </div>
      <div class="tournament-ops__grid">
        ${renderTables(tables)}
        ${renderRecords(records)}
        ${renderAppeals(appeals)}
        ${renderMissingApiNotes()}
      </div>
    </section>
  `;
}

function renderLoading() {
  return `
    <section class="section">
      <div class="section__header">
        <p class="eyebrow">2. Tournament Ops</p>
        <h2>第三步：赛事管理员工作台</h2>
        <p>正在加载赛事桌况、对局记录和申诉工单。</p>
      </div>
      <div class="card public-hall__loading">Loading tournament operations...</div>
    </section>
  `;
}

export async function initTournamentOps(container: HTMLElement) {
  const state: TournamentOpsState = { ...DEFAULT_STATE };

  async function render() {
    container.innerHTML = renderLoading();

    const [tables, records, appeals] = await Promise.all([
      loadTables(state),
      loadRecords(state),
      loadAppeals(state),
    ]);

    container.innerHTML = renderLayout(state, tables, records, appeals);
    bindEvents();
  }

  function bindEvents() {
    container
      .querySelector<HTMLSelectElement>('[data-filter="ops-tournament"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        const activeTournament =
          tournamentContexts.find((tournament) => tournament.id === target.value) ?? tournamentContexts[0];
        state.tournamentId = activeTournament.id;
        state.stageId = activeTournament.stages[0]?.id ?? '';
        void render();
      });

    container
      .querySelector<HTMLSelectElement>('[data-filter="ops-stage"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        state.stageId = target.value;
        void render();
      });

    container
      .querySelector<HTMLSelectElement>('[data-filter="ops-table-status"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        state.tableStatus = target.value as TableStatus | '';
        void render();
      });

    container
      .querySelector<HTMLInputElement>('[data-filter="ops-player-id"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLInputElement;
        state.playerId = target.value.trim();
        void render();
      });

    container
      .querySelector<HTMLSelectElement>('[data-filter="ops-appeal-status"]')
      ?.addEventListener('change', (event) => {
        const target = event.currentTarget as HTMLSelectElement;
        state.appealStatus = target.value as AppealSummary['status'] | '';
        void render();
      });

    container
      .querySelector<HTMLButtonElement>('[data-action="reload-tournament-ops"]')
      ?.addEventListener('click', () => {
        void render();
      });
  }

  await render();
}
