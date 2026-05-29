import type { Dashboard, DashboardOwner } from '@/objects/opsanalytics';
import type { DashboardSummary } from '@/pages/objects/OpsAnalyticsDashboard';

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDecimal(value: number) {
  return value.toFixed(2);
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
    ownerType === 'player' ? 'Player dashboard' : 'Club dashboard';

  return {
    ownerId,
    ownerType,
    headline: `${subjectLabel} updated at ${item.lastUpdatedAt}`,
    metrics: [
      {
        label: 'Samples',
        value: String(item.sampleSize),
        accent: 'gold',
      },
      {
        label: 'Win rate',
        value: formatPercent(item.winRate),
        accent: 'teal',
      },
      {
        label: 'Average placement',
        value: formatDecimal(item.averagePlacement || 0),
      },
      {
        label: 'Riichi rate',
        value: formatPercent(item.riichiRate),
      },
    ],
  };
}
