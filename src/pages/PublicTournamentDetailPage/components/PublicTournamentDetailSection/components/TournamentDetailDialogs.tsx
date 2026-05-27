import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  StatusPill,
  Textarea,
} from '@/components/ui';
import type {
  AppealSummary,
  TableDetail,
} from '@/pages/objects/tournament';

import { detailShellClassNames } from '../styles';
import type { TournamentDetailTableItem } from '../../../objects/tournament-detail.types';
import {
  type AppealDecisionType,
  getAppealDecisionLabel,
  getSeatStatusLabel,
  getSeatStatusTone,
} from '../../../objects/tournament-detail.view';

type PendingStartConfirmation = {
  tableId: string;
  tableCode: string;
  unreadyPlayerNames: string[];
};

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

export function PendingStartConfirmationDialog({
  pendingStartConfirmation,
  isSubmittingTableAction,
  onClose,
  onForceStart,
}: {
  pendingStartConfirmation: PendingStartConfirmation | null;
  isSubmittingTableAction: boolean;
  onClose: () => void;
  onForceStart: () => void;
}) {
  return (
    <Dialog
      open={!!pendingStartConfirmation}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>
              {pendingStartConfirmation
                ? `${pendingStartConfirmation.tableCode} \u8fd8\u6709\u73a9\u5bb6\u672a\u51c6\u5907`
                : '\u8fd8\u6709\u73a9\u5bb6\u672a\u51c6\u5907'}
            </DialogTitle>
            <DialogDescription>
              {
                '\u4ee5\u4e0b\u73a9\u5bb6\u8fd8\u6ca1\u6709\u5b8c\u6210\u51c6\u5907\uff0c\u53ef\u4ee5\u9009\u62e9\u518d\u7b49\u7b49\uff0c\u6216\u8005\u76f4\u63a5\u5f3a\u5236\u5f00\u684c\u3002'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4 px-6 py-5">
            <div className="grid gap-2 rounded-[20px] border border-[rgba(236,197,122,0.22)] bg-[rgba(236,197,122,0.08)] p-4">
              {pendingStartConfirmation?.unreadyPlayerNames.map((playerName) => (
                <span key={playerName} className="text-sm text-[#c7d6e2]">
                  {playerName}
                </span>
              ))}
            </div>
          </DialogBody>
          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmittingTableAction}
            >
              {'\u518d\u7b49\u7b49'}
            </Button>
            <Button onClick={onForceStart} disabled={isSubmittingTableAction}>
              {isSubmittingTableAction ? '\u5904\u7406\u4e2d...' : '\u5f3a\u5236\u5f00\u684c'}
            </Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}

export function AppealDecisionDialog({
  selectedAppealAction,
  appealVerdict,
  appealActionError,
  submittingAppealId,
  onClose,
  onVerdictChange,
  onSubmit,
}: {
  selectedAppealAction: {
    appeal: AppealSummary;
    decision: AppealDecisionType;
  } | null;
  appealVerdict: string;
  appealActionError: string;
  submittingAppealId: string;
  onClose: () => void;
  onVerdictChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog
      open={!!selectedAppealAction}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>
              {selectedAppealAction
                ? `${getAppealDecisionLabel(selectedAppealAction.decision)}申诉工单`
                : '处理申诉工单'}
            </DialogTitle>
            <DialogDescription>
              {selectedAppealAction
                ? `工单 ${selectedAppealAction.appeal.id} 将被标记为“${getAppealDecisionLabel(selectedAppealAction.decision)}”。`
                : '填写处理结论后提交。'}
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4 px-6 py-5">
            {appealActionError ? (
              <Alert variant="danger">{appealActionError}</Alert>
            ) : null}
            {selectedAppealAction ? (
              <div className="grid gap-2 rounded-[20px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] p-4 text-sm text-[#c7d6e2]">
                <strong className="text-[#f2f7fb]">
                  {selectedAppealAction.appeal.id}
                </strong>
                <span>{`牌桌：${selectedAppealAction.appeal.tableId}`}</span>
                <span>
                  {selectedAppealAction.appeal.description ||
                    '未填写申诉说明。'}
                </span>
              </div>
            ) : null}
            <label className="grid gap-3 text-sm text-[#c7d6e2]">
              <span className="font-medium text-[#f2f7fb]">处理结论</span>
              <Textarea
                value={appealVerdict}
                onChange={(event) => onVerdictChange(event.target.value)}
                placeholder="请填写这次申诉的处理说明。"
                maxLength={1000}
              />
            </label>
          </DialogBody>
          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
            <p className="m-0 text-sm text-[#9ab0c1]">
              {selectedAppealAction
                ? `当前操作：${getAppealDecisionLabel(selectedAppealAction.decision)}`
                : ''}
            </p>
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={!!submittingAppealId}
            >
              取消
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!selectedAppealAction || !!submittingAppealId}
            >
              {submittingAppealId ? '提交中...' : '确认提交'}
            </Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
