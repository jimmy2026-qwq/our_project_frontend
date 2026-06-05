import type { Dashboard, DashboardOwner } from '@/objects/opsanalytics';
import type { DashboardSummary } from '@/pages/objects/OpsAnalyticsDashboard';

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDecimal(value: number) {
  return value.toFixed(2);
}

function formatDashboardTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function toDashboardOwner(
  owner: DashboardOwner,
): Pick<DashboardSummary, 'ownerId' | 'ownerType'> {
  const [kind, value] = owner.split(':', 2);

  if (kind === 'player' && value) {
    return { ownerId: value, ownerType: 'player' };
  }

  if (kind === 'club' && value) {
    return { ownerId: value, ownerType: 'club' };
  }

  return { ownerId: 'unknown', ownerType: 'player' };
}

export function toDashboardSummary(item: Dashboard): DashboardSummary {
  const { ownerId, ownerType } = toDashboardOwner(item.owner);
  const subjectLabel =
    ownerType === 'player' ? '个人数据看板' : '俱乐部数据看板';

  return {
    ownerId,
    ownerType,
    headline: `${subjectLabel}更新于 ${formatDashboardTime(item.lastUpdatedAt)}`,
    metrics: [
      {
        label: '样本数',
        value: String(item.sampleSize),
        accent: 'gold',
      },
      {
        label: '胜率',
        value: formatPercent(item.winRate),
        accent: 'teal',
      },
      {
        label: '平均顺位',
        value: formatDecimal(item.averagePlacement || 0),
      },
      {
        label: '立直率',
        value: formatPercent(item.riichiRate),
      },
    ],
  };
}
