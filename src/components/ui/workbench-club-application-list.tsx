import type { ReactNode } from 'react';

import { ClubApplicationStatuses, type ClubApplicationStatus } from '@/objects';

import { EmptyState } from './feedback';
import { InlineActions } from './layout';
import { ListRow } from './detail-layout';
import { StatusPill } from './status-pill';

export interface ClubApplicationListItem {
  id: string;
  title: ReactNode;
  message: ReactNode;
  submittedAt: ReactNode;
  status: ClubApplicationStatus;
  meta?: ReactNode;
  actions?: ReactNode;
}

function getApplicationStatusTone(status: ClubApplicationStatus) {
  switch (status) {
    case ClubApplicationStatuses.Pending:
      return 'warning';
    case ClubApplicationStatuses.Approved:
      return 'success';
    case ClubApplicationStatuses.Rejected:
    case ClubApplicationStatuses.Withdrawn:
      return 'neutral';
    default:
      return 'info';
  }
}

function getApplicationStatusLabel(status: ClubApplicationStatus) {
  switch (status) {
    case ClubApplicationStatuses.Pending:
      return '待处理';
    case ClubApplicationStatuses.Approved:
      return '已通过';
    case ClubApplicationStatuses.Rejected:
      return '已拒绝';
    case ClubApplicationStatuses.Withdrawn:
      return '已撤回';
    default:
      return status;
  }
}

/** 工作台和俱乐部页共用的入会申请列表。 */
export function ClubApplicationList({
  items,
  emptyText,
}: {
  items: ClubApplicationListItem[];
  emptyText: ReactNode;
}) {
  if (items.length === 0) {
    return <EmptyState asListItem={false}>{emptyText}</EmptyState>;
  }

  return (
    <ul className="m-0 grid list-none gap-0 p-0">
      {items.map((item) => (
        <ListRow
          key={item.id}
          main={
            <>
              <strong>{item.title}</strong>
              <span>{item.message}</span>
              <span>{item.submittedAt}</span>
            </>
          }
          aside={
            <>
              <StatusPill tone={getApplicationStatusTone(item.status)}>
                {getApplicationStatusLabel(item.status)}
              </StatusPill>
              {item.meta ? <span>{item.meta}</span> : null}
              {item.actions ? (
                <InlineActions>{item.actions}</InlineActions>
              ) : null}
            </>
          }
        />
      ))}
    </ul>
  );
}
