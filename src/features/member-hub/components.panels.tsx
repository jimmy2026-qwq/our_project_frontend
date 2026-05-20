import { DataPanel, MetricCard, MetricGrid } from '@/components/ui';
import {
  ClubApplicationList,
  DashboardFallbackNotice,
  DashboardPanelShell,
} from '@/components/ui';
import { EmptyState } from '@/components/ui';
import { ActionButton } from '@/components/ui';

import { formatDateTime, getActiveOperator } from './data';
import type {
  ApplicationInboxPanelProps,
  DashboardPanelProps,
  DashboardPlaceholderProps,
} from './components.types';

function DashboardMetrics({ loadState }: Pick<DashboardPanelProps, 'loadState'>) {
  if (!loadState.dashboard) {
    return <EmptyState>No dashboard data is currently available.</EmptyState>;
  }

  return (
    <>
      <p>{loadState.dashboard.headline}</p>
      <MetricGrid>
        {loadState.dashboard.metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            accent={metric.accent ?? 'default'}
          />
        ))}
      </MetricGrid>
    </>
  );
}

export function DashboardPlaceholder({
  title,
  path,
  loadState,
  roleNote,
}: DashboardPlaceholderProps) {
  return (
    <DashboardPanelShell
      title={title}
      source={loadState.source}
      warning={loadState.warning}
      path={path}
      className="dashboard-card border-dashed"
      fallback={
        <DashboardFallbackNotice>
          <>
            <p>
              This panel still keeps the current "show API dashboard when
              available, otherwise fall back to an explanatory placeholder"
              pattern so the page stays stable during the migration.
            </p>
            <p>{roleNote}</p>
          </>
        </DashboardFallbackNotice>
      }
    />
  );
}

export function ApplicationInboxPanel({
  directory,
  state,
  inboxState,
  onReview,
}: ApplicationInboxPanelProps) {
  const activeOperator = getActiveOperator(directory, state.operatorId);

  if (activeOperator.role !== 'ClubAdmin') {
    return (
      <DataPanel
        title="Club Application Inbox"
        description="Only club admins can review pending membership applications."
      >
        <EmptyState>
          The current operator is not a club admin, so this panel stays in an
          explanatory state.
        </EmptyState>
      </DataPanel>
    );
  }

  const pendingCount = inboxState.items.filter(
    (item) => item.status === 'Pending',
  ).length;

  return (
    <DataPanel
      title="Club Application Inbox"
      description="Prefer the backend queue first, then fall back to the local inbox bridge if the API is unavailable."
      source={inboxState.source}
      warning={inboxState.warning}
      badgeLabel={`Pending ${pendingCount}`}
    >
      <ClubApplicationList
        items={inboxState.items.map((item) => ({
          id: item.applicationId,
          title: item.applicant.displayName,
          message: item.message,
          submittedAt: formatDateTime(item.submittedAt),
          status: item.status,
          meta: item.applicant.playerId,
          actions:
            item.canReview && item.status === 'Pending' ? (
              <>
                <ActionButton
                  onClick={() => onReview(item.applicationId, 'approve')}
                >
                  Approve
                </ActionButton>
                <ActionButton
                  onClick={() => onReview(item.applicationId, 'reject')}
                >
                  Reject
                </ActionButton>
              </>
            ) : null,
        }))}
        emptyText="No pending applications are available right now."
      />
    </DataPanel>
  );
}

export function DashboardPanel({ title, path, loadState }: DashboardPanelProps) {
  return (
    <DashboardPanelShell
      title={title}
      path={path}
      source={loadState.source}
      warning={loadState.warning}
      className="dashboard-card"
    >
      <DashboardMetrics loadState={loadState} />
    </DashboardPanelShell>
  );
}
