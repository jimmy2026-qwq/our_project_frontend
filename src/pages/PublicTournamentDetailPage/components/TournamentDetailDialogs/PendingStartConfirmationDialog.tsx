import {
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
} from '@/components/ui';

type PendingStartConfirmation = {
  tableId: string;
  tableCode: string;
  unreadyPlayerNames: string[];
};

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
