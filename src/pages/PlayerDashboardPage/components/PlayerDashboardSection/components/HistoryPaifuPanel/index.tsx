import { Link } from 'react-router-dom';

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  EmptyState,
} from '@/components/ui';
import type { MatchRecordSummary } from '@/pages/objects/tournament';

import { detailShellClassNames } from '../../styles';
import { formatDateTime } from '../../objects/PlayerDashboard.labels';
import { useHistoryPaifuPanel } from './hooks/HistoryPaifuPanel.hooks';

export function HistoryPaifuPanel({ items }: { items: MatchRecordSummary[] }) {
  const panel = useHistoryPaifuPanel();

  return (
    <>
      <section className={detailShellClassNames.list}>
        <div className={detailShellClassNames.listBody}>
          {items.length > 0 ? (
            items.map((record) => (
              <article key={record.id} className={detailShellClassNames.listRow}>
                <div className={detailShellClassNames.listRowMain}>
                  <strong>{record.tournamentName ?? record.tournamentId}</strong>
                  <span>{record.stageName ?? record.stageId}</span>
                </div>
                <div className={detailShellClassNames.listRowSide}>
                  <span>{formatDateTime(record.recordedAt)}</span>
                  <div className={detailShellClassNames.actionRow}>
                    <button
                      type="button"
                      className={detailShellClassNames.action}
                      onClick={() => panel.setSummaryRecord(record)}
                    >
                      查看摘要
                    </button>
                    <Link
                      className={detailShellClassNames.action}
                      to={`/tables/${record.tableId}/paifu`}
                    >
                      查看牌谱
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState asListItem={false}>暂无历史牌谱。</EmptyState>
          )}
        </div>
      </section>

      <Dialog
        open={!!panel.summaryRecord}
        onOpenChange={(open) => {
          if (!open) {
            panel.setSummaryRecord(null);
          }
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogSurface className="text-[#f2f7fb]">
            <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
              <DialogTitle className="text-[#f2f7fb]">牌谱摘要</DialogTitle>
            </DialogHeader>
            <DialogBody className="grid gap-3 px-6 py-5 text-[#f2f7fb]">
              <p className="m-0 text-sm text-[#9ab0c1]">
                {panel.summaryRecord
                  ? `记录 ${panel.summaryRecord.id} / ${formatDateTime(panel.summaryRecord.recordedAt)}`
                  : ''}
              </p>
              <p className="m-0 whitespace-pre-wrap leading-7 text-[#f2f7fb]">
                {panel.summaryRecord?.summary || '暂无摘要'}
              </p>
            </DialogBody>
            <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
              <Button onClick={() => panel.setSummaryRecord(null)}>关闭</Button>
            </DialogFooter>
          </DialogSurface>
        </DialogPortal>
      </Dialog>
    </>
  );
}
