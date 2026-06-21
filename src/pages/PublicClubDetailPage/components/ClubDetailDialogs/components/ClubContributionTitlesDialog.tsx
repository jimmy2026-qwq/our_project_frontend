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
} from '@/components/ui';

import type {
  ClubContributionTitleDraft,
  ClubContributionTitleField,
} from '../../../objects/ClubDetail.types';
import { ClubContributionTitleFieldCard } from './ClubContributionTitleFieldCard';
import { ClubContributionTitlePresetSelect } from './ClubContributionTitlePresetSelect';

/** 管理俱乐部贡献区间称号的弹窗。 */
export function ClubContributionTitlesDialog({
  open,
  fields,
  canManage,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  fields: ClubContributionTitleField[];
  canManage: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (drafts: ClubContributionTitleDraft[]) => Promise<void>;
}) {
  const [draftLabels, setDraftLabels] = useState<Record<string, string>>({});
  const normalizedDrafts = useMemo(
    () =>
      fields.map((field) => ({
        rankCode: field.rankCode,
        label: (draftLabels[field.rankCode] ?? field.displayLabel).trim(),
      })),
    [draftLabels, fields],
  );
  const hasChanges = normalizedDrafts.some((draft) => {
    const current = fields.find((field) => field.rankCode === draft.rankCode);

    return !!current && draft.label !== current.displayLabel;
  });
  const hasEmptyLabel = normalizedDrafts.some(
    (draft) => draft.label.length === 0,
  );
  const canSubmit = canManage && hasChanges && !hasEmptyLabel && !isSubmitting;

  useEffect(() => {
    if (!open) {
      setDraftLabels({});
      return;
    }

    setDraftLabels(
      Object.fromEntries(
        fields.map((field) => [field.rankCode, field.displayLabel]),
      ),
    );
  }, [fields, open]);

  function applyPresetLabels(labels: Record<string, string>) {
    setDraftLabels((current) => ({
      ...current,
      ...Object.fromEntries(
        fields.flatMap((field) => {
          const nextLabel = labels[field.rankCode];

          return nextLabel ? [[field.rankCode, nextLabel] as const] : [];
        }),
      ),
    }));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface className="w-[min(620px,calc(100%-40px))] text-[#f2f7fb]">
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>通用贡献头衔</DialogTitle>
            <DialogDescription>
              阈值由当前俱乐部等级树决定，这里只调整每个贡献等级显示出来的中文头衔。
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="max-h-[min(64vh,620px)] overflow-y-auto px-6 py-5">
            <div className="grid gap-4">
              {canManage ? (
                <ClubContributionTitlePresetSelect
                  disabled={isSubmitting}
                  onSelect={applyPresetLabels}
                />
              ) : null}

              {fields.map((field) => (
                <ClubContributionTitleFieldCard
                  key={field.rankCode}
                  canManage={canManage}
                  draftLabel={draftLabels[field.rankCode] ?? field.displayLabel}
                  field={field}
                  isSubmitting={isSubmitting}
                  onLabelChange={(nextValue) =>
                    setDraftLabels((current) => ({
                      ...current,
                      [field.rankCode]: nextValue,
                    }))
                  }
                  onRestoreDefault={() =>
                    setDraftLabels((current) => ({
                      ...current,
                      [field.rankCode]: field.defaultLabel,
                    }))
                  }
                />
              ))}
            </div>
          </DialogBody>

          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            {canManage ? (
              <div className="grid w-full gap-3 sm:grid-cols-2">
                <ActionButton
                  disabled={!canSubmit}
                  onClick={() => void onSubmit(normalizedDrafts)}
                >
                  {isSubmitting ? '保存中...' : '保存通用头衔'}
                </ActionButton>
                <ActionButton
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  取消
                </ActionButton>
              </div>
            ) : (
              <ActionButton
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                关闭
              </ActionButton>
            )}
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
