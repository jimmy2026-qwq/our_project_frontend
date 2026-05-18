import type { DashboardSummary } from '@/objects/opsanalytics';
import type {
  DashboardContract,
  DashboardOwnerContract,
} from '@/objects/opsanalytics';

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDecimal(value: number) {
  return value.toFixed(2);
}

export function parseDashboardOwner(
  owner: DashboardOwnerContract,
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

export function mapDashboard(item: DashboardContract): DashboardSummary {
  const { ownerId, ownerType } = parseDashboardOwner(item.owner);
  const subjectLabel =
    ownerType === 'player' ? '个人数据看板' : '俱乐部数据看板';

  return {
    ownerId,
    ownerType,
    headline: `${subjectLabel}已根据后端聚合数据完成同步。`,
    metrics: [
      {
        label: '样本数',
        value: String(item.sampleSize),
        accent: 'gold',
      },
      {
        label: '和牌率',
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
