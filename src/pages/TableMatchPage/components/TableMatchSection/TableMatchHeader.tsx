import { Link } from 'react-router-dom';

import { Badge, Button, StatusPill } from '@/components/ui';
import type { TableDetail } from '@/pages/objects/tournament';

import {
  getTableStatusLabel,
  matchBackLinkClassName,
} from '../../objects/TableMatch.labels';
import type { TableSeat } from '../../objects/TableMatch.types';

interface TableMatchHeaderProps {
  table: TableDetail;
  backLink: string;
  isRefreshing: boolean;
  canUpdateOwnReady: boolean;
  isUpdatingOwnReady: boolean;
  ownSeat: TableSeat | null;
  onRefresh: () => void;
  onToggleOwnReady: () => void;
}

export function TableMatchHeader({
  table,
  backLink,
  isRefreshing,
  canUpdateOwnReady,
  isUpdatingOwnReady,
  ownSeat,
  onRefresh,
  onToggleOwnReady,
}: TableMatchHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>牌桌对局</Badge>
          <StatusPill
            tone={table.status === 'InProgress' ? 'success' : 'warning'}
          >
            {getTableStatusLabel(table.status)}
          </StatusPill>
          {isRefreshing ? <Badge>刷新中</Badge> : null}
        </div>
        <div>
          <h1 className="text-[clamp(2rem,3vw,2.5rem)] font-semibold text-[#f2f7fb]">
            牌桌 {String(table.tableNo).padStart(2, '0')}
          </h1>
          <p className="text-[#c7d6e2]">
            牌桌 ID {table.id} / 赛段 {table.stageId}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {canUpdateOwnReady && ownSeat ? (
          <Button onClick={onToggleOwnReady} disabled={isUpdatingOwnReady}>
            {isUpdatingOwnReady
              ? '正在更新...'
              : ownSeat.ready
                ? '取消准备'
                : '标记为已准备'}
          </Button>
        ) : null}
        <Button variant="outline" onClick={onRefresh}>
          刷新
        </Button>
        <Link to={backLink} className={matchBackLinkClassName()}>
          返回赛事
        </Link>
      </div>
    </div>
  );
}
