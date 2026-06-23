import { DashboardFallbackNotice, DashboardPanelShell, EmptyState, MetricCard, MetricGrid } from '@/components/ui';

import { DashboardLoadState } from '../objects/state/DashboardLoadState';


interface DashboardPanelProps {
  title: string;
  path: string;
  loadState: DashboardLoadState;
}

interface DashboardPlaceholderProps extends DashboardPanelProps {
  roleNote: string;
}

/** 成员中心仪表盘中的俱乐部、赛事和申请数量指标。 */
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

/** 成员中心在暂无 dashboard 数据时展示的占位说明。 */
export function DashboardPlaceholder({
  title,
  path,
  loadState,
  roleNote,
}: DashboardPlaceholderProps) {
  return (
    <DashboardPanelShell
      title={title}
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

/** 成员中心 dashboard 主面板，展示统计指标和入口说明。 */
export function DashboardPanel({
  title,
  path,
  loadState,
}: DashboardPanelProps) {
  return (
    <DashboardPanelShell
      title={title}
      path={path}
      warning={loadState.warning}
    >
      <DashboardMetrics loadState={loadState} />
    </DashboardPanelShell>
  );
}
