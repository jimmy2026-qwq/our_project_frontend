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
    return <EmptyState>当前没有可用的看板数据。</EmptyState>;
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
            <p>接口数据不可用时，这里会保留说明占位，避免页面空白。</p>
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
