import { useEffect, useState } from 'react';

import { FieldGroup, TextInputField } from '@/components/ui';
import { ActionButton } from '@/components/ui';
import {
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
import { useCreateClubDialogAction } from '../hooks';

export function CreateClubDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState('');
  const {
    canCreate,
    creatorName,
    isSubmitting,
    handleSubmit,
  } = useCreateClubDialogAction({
    open,
    name,
    onOpenChange,
  });

  useEffect(() => {
    if (!open) {
      setName('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>创建俱乐部</DialogTitle>
            <DialogDescription>
              创建成功后，你会自动成为该俱乐部的管理员。
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            <FieldGroup>
              <TextInputField
                label="俱乐部名称"
                value={name}
                placeholder="例如：东风俱乐部"
                onChange={(event) => setName(event.currentTarget.value)}
                disabled={isSubmitting}
              />
              <TextInputField
                label="创建者"
                value={creatorName}
                readOnly
              />
            </FieldGroup>
          </DialogBody>

          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <ActionButton
                onClick={() => void handleSubmit()}
                disabled={!canCreate}
              >
                {isSubmitting ? '创建中...' : '创建并进入详情'}
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                取消
              </ActionButton>
            </div>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
