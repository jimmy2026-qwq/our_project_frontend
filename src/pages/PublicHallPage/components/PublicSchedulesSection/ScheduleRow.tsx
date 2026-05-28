import { Link } from 'react-router-dom';

import { StatusPill } from '@/components/ui';
import type { PublicSchedule } from '../../objects/PublicHallPage.types';
import {
  formatDateTime,
  getTournamentStatusLabel,
} from '../../functions/getPublicHallLabels';

import { getStatusTone } from '../../functions/getPublicHallStatus';
import { hallSectionClassNames } from '../PublicHallSection.styles';

export function ScheduleRow({ item }: { item: PublicSchedule }) {
  return (
    <article
      key={`${item.tournamentId}-${item.stageId}`}
      className={hallSectionClassNames.row}
    >
      <div className={hallSectionClassNames.rowMain}>
        <div className="flex flex-wrap items-center gap-2">
          <strong>{item.tournamentName}</strong>
          {item.isUnpublished ? (
            <StatusPill tone="warning">未发布</StatusPill>
          ) : null}
        </div>
        <span>{item.stageName}</span>
        <span>{`开始时间：${formatDateTime(item.scheduledAt)}`}</span>
      </div>
      <div className={hallSectionClassNames.rowSide}>
        <StatusPill
          className={hallSectionClassNames.status}
          tone={getStatusTone(item.tournamentStatus)}
        >
          {getTournamentStatusLabel(item.tournamentStatus)}
        </StatusPill>
        <Link
          className={hallSectionClassNames.action}
          to={`/public/tournaments/${item.tournamentId}`}
        >
          查看赛事详情
        </Link>
      </div>
    </article>
  );
}
