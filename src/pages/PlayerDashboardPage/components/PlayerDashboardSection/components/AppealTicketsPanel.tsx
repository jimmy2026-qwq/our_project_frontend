import { EmptyState, StatusPill } from '@/components/ui';
import type { AppealSummary } from '@/pages/objects/tournament';

import { detailShellClassNames } from '../styles';
import {
  formatDateTime,
  getAppealStatusLabel,
  getAppealStatusTone,
} from '../objects/PlayerDashboard.labels';

export function AppealTicketsPanel({ items }: { items: AppealSummary[] }) {
  return (
    <section className={detailShellClassNames.list}>
      <div className={detailShellClassNames.listBody}>
        {items.length > 0 ? (
          items.map((appeal) => (
            <article key={appeal.id} className={detailShellClassNames.listRow}>
              <div className={detailShellClassNames.listRowMain}>
                <strong>{appeal.id}</strong>
                <span>{`牌桌 ID：${appeal.tableId}`}</span>
                <span>{appeal.description || '未填写申诉说明。'}</span>
              </div>
              <div className={detailShellClassNames.listRowSide}>
                <StatusPill tone={getAppealStatusTone(appeal.status)}>
                  {getAppealStatusLabel(appeal.status)}
                </StatusPill>
                <span>{`提交时间：${formatDateTime(appeal.createdAt)}`}</span>
                <span>{`最近更新：${formatDateTime(appeal.updatedAt ?? appeal.createdAt)}`}</span>
                <span>{`处理结果：${appeal.resolution || '待处理'}`}</span>
              </div>
            </article>
          ))
        ) : (
          <EmptyState asListItem={false}>
            你还没有提交过赛事申诉工单。
          </EmptyState>
        )}
      </div>
    </section>
  );
}
