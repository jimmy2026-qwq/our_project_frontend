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

export function PublishBlockedDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>暂时无法发布比赛</DialogTitle>
            <DialogDescription>
              请先至少选择一个参赛俱乐部，再发布这场比赛。
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="px-6 py-5">
            <p className="m-0 text-[#9ab0c1]">
              请先邀请或登记俱乐部参赛，然后再尝试发布。
            </p>
          </DialogBody>
          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
