import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import {
  DescriptionItem,
  DescriptionList,
  EmptyState,
  MetricCard,
  MetricGrid,
} from '@/components/ui';
import { cx } from '@/components/ui/cx';

import { detailShellClassNames } from './player-dashboard.styles';
import type { PlayerClubLink, PlayerDashboardData } from '../objects/data';

function ShellDetailCard({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className={detailShellClassNames.card}>
      <div className={detailShellClassNames.cardHeader}>
        <h3 className={cx('m-0', detailShellClassNames.cardTitle)}>
          {title}
        </h3>
      </div>
      <div className={detailShellClassNames.cardContent}>{children}</div>
    </article>
  );
}

function ShellDetailList({ children }: { children: ReactNode }) {
  return (
    <DescriptionList className={detailShellClassNames.detailList}>
      {children}
    </DescriptionList>
  );
}

function ShellDetailListItem({
  label,
  value,
}: {
  label: ReactNode;
  value: ReactNode;
}) {
  return (
    <DescriptionItem
      className={detailShellClassNames.detailItem}
      label={label}
      value={value}
    />
  );
}

function formatClubLinks(clubs: PlayerClubLink[]) {
  if (clubs.length === 0) {
    return '暂无所属俱乐部';
  }

  return (
    <span className="inline-flex flex-wrap gap-x-2 gap-y-1">
      {clubs.map((club, index) => (
        <span key={club.id} className="inline-flex gap-2">
          {index > 0 ? <span className="text-[#9ab0c1]">/</span> : null}
          <Link
            className="text-[#8fe8e1] no-underline hover:text-[#b2f4ef] hover:underline"
            to={`/public/clubs/${club.id}`}
          >
            {club.name}
          </Link>
        </span>
      ))}
    </span>
  );
}

function getPlayerStatusLabel(status?: string) {
  switch (status) {
    case 'Active':
      return '正常';
    case 'Inactive':
      return '停用';
    case 'Banned':
      return '封禁';
    default:
      return status || '--';
  }
}

export function PlayerHomePanel({
  player,
  playerClubs,
  dashboard,
}: {
  player: PlayerDashboardData['player'];
  playerClubs: PlayerDashboardData['playerClubs'];
  dashboard: PlayerDashboardData['dashboard'];
}) {
  return (
    <div className={detailShellClassNames.homeGrid}>
      <ShellDetailCard title="个人资料">
        <ShellDetailList>
          <ShellDetailListItem label="昵称" value={player.displayName} />
          <ShellDetailListItem label="玩家 ID" value={player.playerId} />
          <ShellDetailListItem
            label="状态"
            value={getPlayerStatusLabel(player.playerStatus)}
          />
          <ShellDetailListItem
            label="ELO"
            value={typeof player.elo === 'number' ? String(player.elo) : '--'}
          />
          <ShellDetailListItem
            label="所属俱乐部"
            value={formatClubLinks(playerClubs)}
          />
        </ShellDetailList>
      </ShellDetailCard>

      <ShellDetailCard title="个人数据看板">
        {dashboard.metrics.length > 0 ? (
          <div className="grid gap-5">
            <p className="m-0 text-[#c7d6e2]">{dashboard.headline}</p>
            <MetricGrid>
              {dashboard.metrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  accent={metric.accent}
                />
              ))}
            </MetricGrid>
          </div>
        ) : (
          <EmptyState asListItem={false}>
            当前还没有可展示的个人数据。
          </EmptyState>
        )}
      </ShellDetailCard>
    </div>
  );
}
