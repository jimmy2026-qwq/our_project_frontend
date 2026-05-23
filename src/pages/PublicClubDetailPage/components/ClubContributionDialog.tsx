import { useEffect, useMemo, useState } from 'react';

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
  TextareaField,
  TextInputField,
} from '@/components/ui';
import { formatNumber } from '@/pages/PublicShared/objects/utils';

import type { ClubAdminMemberEntry } from '../objects/club-detail.types';

export function ClubContributionDialog({
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
  onSubmit: (
    member: ClubAdminMemberEntry,
    delta: number,
    note?: string,
  ) => Promise<void>;
}) {
  const [deltaInput, setDeltaInput] = useState('');
  const [note, setNote] = useState('');
  const currentContribution = member?.contribution ?? 0;
  const parsedDelta = Number(deltaInput);
  const canSubmit =
    !!member &&
    Number.isInteger(parsedDelta) &&
    parsedDelta !== 0 &&
    currentContribution + parsedDelta >= 0 &&
    !isSubmitting;
  const nextContribution = useMemo(() => {
    if (!Number.isFinite(parsedDelta)) {
      return currentContribution;
    }

    return currentContribution + parsedDelta;
  }, [currentContribution, parsedDelta]);

  useEffect(() => {
    if (!open) {
      setDeltaInput('');
      setNote('');
    }
  }, [open]);

  useEffect(() => {
    setDeltaInput('');
    setNote('');
  }, [member?.playerId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>修改贡献值</DialogTitle>
            <DialogDescription>
              调整成员在当前俱乐部中的贡献值，变化值可以为正数或负数。
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
                label="当前贡献值"
                value={formatNumber(currentContribution)}
                readOnly
              />
              <TextInputField
                label="变化值"
                type="number"
                step={1}
                value={deltaInput}
                placeholder="例如 100 或 -50"
                onChange={(event) => setDeltaInput(event.currentTarget.value)}
                disabled={isSubmitting}
              />
              <TextInputField
                label="调整后贡献值"
                value={formatNumber(nextContribution)}
                readOnly
              />
              <TextareaField
                label="调整理由"
                rows={4}
                value={note}
                placeholder="可选，用于审计记录"
                onChange={(event) => setNote(event.currentTarget.value)}
                disabled={isSubmitting}
              />
            </FieldGroup>
          </DialogBody>

          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <ActionButton
                onClick={() =>
                  member ? void onSubmit(member, parsedDelta, note) : undefined
                }
                disabled={!canSubmit}
              >
                {isSubmitting ? '提交中...' : '确认修改'}
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
