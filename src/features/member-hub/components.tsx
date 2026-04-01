import { DataPanel, MetricCard, MetricGrid } from '@/components/shared/data-display';
import { ClubApplicationList, DashboardFallbackNotice, DashboardPanelShell, WorkbenchContextPanel } from '@/components/shared/domain';
import { EmptyState, LoadingSection } from '@/components/shared/feedback';
import { SelectField } from '@/components/shared/forms';
import { ActionButton, SectionIntro } from '@/components/shared/layout';
import { mockClubs } from '@/mocks/overview';

import {
  formatDateTime,
  getActiveOperator,
  mockOperators,
  type ApplicationInboxState,
  type DashboardLoadState,
  type MemberHubState,
} from './data';

function DashboardMetrics({ payload }: { payload: DashboardLoadState }) {
  if (!payload.dashboard) {
    return <EmptyState>No dashboard data is currently available.</EmptyState>;
  }

  return (
    <>
      <p>{payload.dashboard.headline}</p>
      <MetricGrid>
        {payload.dashboard.metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} accent={metric.accent ?? 'default'} />
        ))}
      </MetricGrid>
    </>
  );
}

function DashboardPlaceholder({
  title,
  path,
  payload,
  roleNote,
}: {
  title: string;
  path: string;
  payload: DashboardLoadState;
  roleNote: string;
}) {
  return (
    <DashboardPanelShell
      title={title}
      source={payload.source}
      warning={payload.warning}
      path={path}
      className="dashboard-card border-dashed"
      fallback={
        <DashboardFallbackNotice>
          <>
            <p>
              This panel still keeps the current "show API dashboard when available, otherwise fall back to an explanatory
              placeholder" pattern so the page stays stable during the migration.
            </p>
            <p>{roleNote}</p>
          </>
        </DashboardFallbackNotice>
      }
    >
    </DashboardPanelShell>
  );
}

function ApplicationInboxPanel({
  state,
  payload,
  onReview,
}: {
  state: MemberHubState;
  payload: ApplicationInboxState;
  onReview: (applicationId: string, decision: 'approve' | 'reject') => void;
}) {
  const activeOperator = getActiveOperator(state.operatorId);

  if (activeOperator.role !== 'ClubAdmin') {
    return (
      <DataPanel
        title="Club Application Inbox"
        description="Only club admins can review pending membership applications."
      >
        <EmptyState>The current operator is not a club admin, so this panel stays in an explanatory state.</EmptyState>
      </DataPanel>
    );
  }

  const pendingCount = payload.items.filter((item) => item.status === 'Pending').length;

  return (
    <DataPanel
      title="Club Application Inbox"
      description="Prefer the backend queue first, then fall back to the local inbox bridge if the API is unavailable."
      source={payload.source}
      warning={payload.warning}
      badgeLabel={`Pending ${pendingCount}`}
    >
      <ClubApplicationList
        items={payload.items.map((item) => ({
          id: item.applicationId,
          title: item.applicant.displayName,
          message: item.message,
          submittedAt: formatDateTime(item.submittedAt),
          status: item.status,
          meta: item.applicant.playerId,
          actions:
            item.canReview && item.status === 'Pending' ? (
              <>
                <ActionButton onClick={() => onReview(item.applicationId, 'approve')}>Approve</ActionButton>
                <ActionButton onClick={() => onReview(item.applicationId, 'reject')}>Reject</ActionButton>
              </>
            ) : null,
        }))}
        emptyText="No pending applications are available right now."
      />
    </DataPanel>
  );
}

function DashboardPanel({
  title,
  path,
  payload,
}: {
  title: string;
  path: string;
  payload: DashboardLoadState;
}) {
  return (
    <DashboardPanelShell title={title} path={path} source={payload.source} warning={payload.warning} className="dashboard-card">
      <DashboardMetrics payload={payload} />
    </DashboardPanelShell>
  );
}

export function MemberHubLoading() {
  return (
    <LoadingSection
      eyebrow="Member Hub"
      title="Member Workspace"
      description="Loading operator context, dashboards, and club application inbox data."
    >
      Loading member hub...
    </LoadingSection>
  );
}

export function MemberHubPageSection({
  state,
  playerPayload,
  clubPayload,
  inboxPayload,
  onReload,
  onChangeOperator,
  onChangePlayer,
  onChangeClub,
  onReview,
}: {
  state: MemberHubState;
  playerPayload: DashboardLoadState;
  clubPayload: DashboardLoadState;
  inboxPayload: ApplicationInboxState;
  onReload: () => void;
  onChangeOperator: (operatorId: string) => void;
  onChangePlayer: (playerId: string) => void;
  onChangeClub: (clubId: string) => void;
  onReview: (applicationId: string, decision: 'approve' | 'reject') => void;
}) {
  const activeOperator = getActiveOperator(state.operatorId);

  return (
    <section className="section">
      <SectionIntro
        eyebrow="Member Hub"
        title="Member Workspace"
        description="This page keeps the React route shell lean while the feature module owns operator switching, dashboards, and inbox review flow."
      />

      <WorkbenchContextPanel
        className="member-hub__controls text-[color:var(--muted-strong)]"
        title="Workspace Context"
        description="Switch operator scope and dashboard targets without pushing that state back into the page shell."
        onReload={onReload}
      >
        <SelectField label="Operator" value={state.operatorId} onChange={(event) => onChangeOperator(event.currentTarget.value)}>
          {mockOperators.map((operator) => (
            <option key={operator.id} value={operator.id}>
              {operator.label}
            </option>
          ))}
        </SelectField>
        <SelectField label="Player dashboard" value={state.playerId} onChange={(event) => onChangePlayer(event.currentTarget.value)}>
          <option value="player-registered-1">Aoi</option>
          <option value="player-registered-2">Mika</option>
        </SelectField>
        <SelectField label="Managed club" value={state.clubId} onChange={(event) => onChangeClub(event.currentTarget.value)}>
          {mockClubs.map((club) => {
            const disabled =
              activeOperator.role !== 'ClubAdmin' || !activeOperator.managedClubIds.includes(club.id);

            return (
              <option key={club.id} value={club.id} disabled={disabled}>
                {club.name}
              </option>
            );
          })}
        </SelectField>
      </WorkbenchContextPanel>

      <div className="member-hub__grid grid gap-[18px] md:grid-cols-2">
        <ApplicationInboxPanel state={state} payload={inboxPayload} onReview={onReview} />
      </div>

      <div className="member-hub__grid grid gap-[18px] md:grid-cols-2">
        {playerPayload.source === 'api' && playerPayload.dashboard ? (
          <DashboardPanel
            title="Player Dashboard"
            path={`/dashboards/players/${state.playerId}?operatorId=${state.operatorId}`}
            payload={playerPayload}
          />
        ) : (
          <DashboardPlaceholder
            title="Player Dashboard"
            path={`/dashboards/players/${state.playerId}?operatorId=${state.operatorId}`}
            payload={playerPayload}
            roleNote="The player dashboard is still using a placeholder path whenever the API does not return a live dashboard yet."
          />
        )}

        {activeOperator.role === 'ClubAdmin' && clubPayload.source === 'api' && clubPayload.dashboard ? (
          <DashboardPanel
            title="Club Dashboard"
            path={`/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}`}
            payload={clubPayload}
          />
        ) : (
          <DashboardPlaceholder
            title="Club Dashboard"
            path={`/dashboards/clubs/${state.clubId}?operatorId=${state.operatorId}`}
            payload={clubPayload}
            roleNote={
              activeOperator.role === 'ClubAdmin'
                ? 'The club dashboard remains in placeholder mode until the API returns a live admin dashboard.'
                : 'This dashboard stays hidden from non-admin operators and remains an explanatory placeholder.'
            }
          />
        )}
      </div>
    </section>
  );
}
