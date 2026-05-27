import {
  Alert,
  AlertDescription,
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

interface AppealDialogProps {
  open: boolean;
  appealDescription: string;
  appealError: string | null;
  operatorId: string;
  canFileAppeal: boolean;
  isSubmittingAppeal: boolean;
  onOpenChange: (open: boolean) => void;
  onDescriptionChange: (description: string) => void;
  onSubmit: () => void;
}

export function AppealDialog({
  open,
  appealDescription,
  appealError,
  operatorId,
  canFileAppeal,
  isSubmittingAppeal,
  onOpenChange,
  onDescriptionChange,
  onSubmit,
}: AppealDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>发起赛事申诉</DialogTitle>
            <DialogDescription>
              请描述本桌需要申诉的情况，提交后会生成一张赛事申诉工单。
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="px-6 py-5">
            {appealError ? (
              <Alert variant="danger">
                <AlertDescription>{appealError}</AlertDescription>
              </Alert>
            ) : null}
            <label className="grid gap-3 text-sm text-[#c7d6e2]">
              <span className="font-medium text-[#f2f7fb]">申诉说明</span>
              <Textarea
                value={appealDescription}
                onChange={(event) => onDescriptionChange(event.target.value)}
                placeholder="例如：第 3 局结算时分数记录有误，请管理员核对牌谱和结算结果。"
                maxLength={1000}
              />
              <span className="text-right text-xs text-[#9ab0c1]">
                {appealDescription.trim().length} / 1000
              </span>
            </label>
          </DialogBody>
          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
            <p className="m-0 text-sm text-[#9ab0c1]">
              提交人：{operatorId || '未登录'}
            </p>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmittingAppeal}
            >
              取消
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!canFileAppeal || isSubmittingAppeal}
            >
              {isSubmittingAppeal ? '提交中...' : '提交申诉'}
            </Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
