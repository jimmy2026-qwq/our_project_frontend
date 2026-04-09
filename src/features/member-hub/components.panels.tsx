import { DataPanel, MetricCard, MetricGrid } from '@/components/shared/data-display';
import { ClubApplicationList, DashboardFallbackNotice, DashboardPanelShell } from '@/components/shared/domain';
import { EmptyState } from '@/components/shared/feedback';
import { ActionButton } from '@/components/shared/layout';

import { formatDateTime, getActiveOperator } from './data';
import type { ApplicationInboxPanelProps, DashboardPanelProps, DashboardPlaceholderProps } from './components.types';

function DashboardMetrics({ payload }: Pick<DashboardPanelProps, 'payload'>) {
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

export function DashboardPlaceholder({ title, path, payload, roleNote }: DashboardPlaceholderProps) {
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
    />
  );
}

export function ApplicationInboxPanel({ directory, state, payload, onReview }: ApplicationInboxPanelProps) {
  const activeOperator = getActiveOperator(directory, state.operatorId);

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

export function DashboardPanel({ title, path, payload }: DashboardPanelProps) {
  return (
    <DashboardPanelShell title={title} path={path} source={payload.source} warning={payload.warning} className="dashboard-card">
      <DashboardMetrics payload={payload} />
    </DashboardPanelShell>
  );
}
