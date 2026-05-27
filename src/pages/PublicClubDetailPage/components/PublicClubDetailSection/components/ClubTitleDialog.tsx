import { useEffect, useState } from 'react';

import {
  ActionButton,
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  FieldGroup,
  TextInputField,
} from '@/components/ui';

import type { ClubAdminMemberEntry } from '../../../objects/club-detail.types';

export function ClubTitleDialog({
  open,
  member,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  member: ClubAdminMemberEntry | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (member: ClubAdminMemberEntry, nextTitle: string) => Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const currentTitle = member?.internalTitle?.trim() ?? '';
  const normalizedTitle = title.trim();
  const canSubmit =
    !!member &&
    !isSubmitting &&
    normalizedTitle !== currentTitle &&
    (normalizedTitle.length > 0 || currentTitle.length > 0);

  useEffect(() => {
    if (open) {
      setTitle(currentTitle);
    } else {
      setTitle('');
    }
  }, [currentTitle, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>设置专属头衔</DialogTitle>
            <DialogDescription>
              为成员设置昵称旁显示的俱乐部专属头衔，留空提交会清除原头衔。
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            <FieldGroup>
              <TextInputField
                label="目标成员"
                value={member?.displayName ?? ''}
                readOnly
              />
              <TextInputField
                label="原头衔"
                value={currentTitle || '--'}
                readOnly
              />
              <TextInputField
                label="新头衔"
                value={title}
                placeholder="例如：主将"
                onChange={(event) => setTitle(event.currentTarget.value)}
                disabled={isSubmitting}
              />
            </FieldGroup>
          </DialogBody>

          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <ActionButton
                onClick={() =>
                  member ? void onSubmit(member, normalizedTitle) : undefined
                }
                disabled={!canSubmit}
              >
                {isSubmitting ? '提交中...' : '确认设置'}
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
