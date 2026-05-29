import {
  DashboardFallbackNotice,
  DashboardPanelShell,
  EmptyState,
  MetricCard,
  MetricGrid,
} from '@/components/ui';

import type { DashboardLoadState } from '../objects/MemberHub.types';

interface DashboardPanelProps {
  title: string;
  path: string;
  loadState: DashboardLoadState;
}

interface DashboardPlaceholderProps extends DashboardPanelProps {
  roleNote: string;
}

function DashboardMetrics({
  loadState,
}: Pick<DashboardPanelProps, 'loadState'>) {
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
      className="border-dashed"
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

export function DashboardPanel({
  title,
  path,
  loadState,
}: DashboardPanelProps) {
  return (
    <DashboardPanelShell
      title={title}
      path={path}
      source={loadState.source}
      warning={loadState.warning}
    >
      <DashboardMetrics loadState={loadState} />
    </DashboardPanelShell>
  );
}
