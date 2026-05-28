import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  StatusPill,
} from '@/components/ui';
import type { TableDetail } from '@/pages/objects/tournament';

import { detailShellClassNames } from '../detailShell.styles';
import type { TournamentDetailTableItem } from '../../objects/TournamentDetail.types';
import {
  getSeatStatusLabel,
  getSeatStatusTone,
} from '../../objects/TournamentDetail.view';

export function ManagedTableDetailDialog({
  selectedManageTable,
  tableDetail,
  tableDetailError,
  isLoadingTableDetail,
  isSubmittingTableAction,
  playerNames,
  onClose,
  onStartTable,
}: {
  selectedManageTable: TournamentDetailTableItem | null;
  tableDetail: TableDetail | null;
  tableDetailError: string;
  isLoadingTableDetail: boolean;
  isSubmittingTableAction: boolean;
  playerNames: Record<string, string>;
  onClose: () => void;
  onStartTable: (
    table: TournamentDetailTableItem,
    detail: TableDetail | null,
  ) => void;
}) {
  return (
    <Dialog
      open={!!selectedManageTable}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface className="text-[#f2f7fb]">
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>
              {selectedManageTable
                ? `${selectedManageTable.tableCode} 牌桌详情`
                : '牌桌详情'}
            </DialogTitle>
          </DialogHeader>
          <DialogBody className="grid gap-4 px-6 py-5 text-[#f2f7fb]">
            {isLoadingTableDetail ? (
              <p className="m-0 text-[#9ab0c1]">正在加载牌桌详情...</p>
            ) : null}
            {tableDetailError ? (
              <Alert variant="danger">{tableDetailError}</Alert>
            ) : null}
            {tableDetail?.seats.map((seat) => (
              <div
                key={seat.seat}
                className={`${detailShellClassNames.seatRow} text-[#f2f7fb]`}
              >
                <div className="grid gap-1">
                  <strong className="text-[#f2f7fb]">{seat.seat}</strong>
                  <span className="text-[#f2f7fb]">
                    {playerNames[seat.playerId] ?? seat.playerId}
                  </span>
                </div>
                <StatusPill tone={getSeatStatusTone(seat)}>
                  {getSeatStatusLabel(seat)}
                </StatusPill>
                <StatusPill tone={seat.disconnected ? 'danger' : 'neutral'}>
                  {seat.disconnected ? '连接异常' : '连接正常'}
                </StatusPill>
              </div>
            ))}
          </DialogBody>
          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <Button variant="secondary" onClick={onClose}>
              关闭
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                selectedManageTable && onStartTable(selectedManageTable, tableDetail)
              }
              disabled={!selectedManageTable || isSubmittingTableAction}
            >
              开启牌桌
            </Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
