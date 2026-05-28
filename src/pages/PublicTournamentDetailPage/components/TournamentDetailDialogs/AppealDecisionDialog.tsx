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
  Textarea,
} from '@/components/ui';
import type { AppealSummary } from '@/pages/objects/tournament';

import {
  type AppealDecisionType,
  getAppealDecisionLabel,
} from '../../objects/TournamentDetail.view';

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
