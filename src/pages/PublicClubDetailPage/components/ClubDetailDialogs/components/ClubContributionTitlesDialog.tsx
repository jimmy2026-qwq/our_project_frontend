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
  TextInputField,
} from '@/components/ui';

import type {
  ClubContributionTitleDraft,
  ClubContributionTitleField,
} from '../../../objects/ClubDetail.types';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface className="w-[min(620px,calc(100%-40px))] text-[#f2f7fb]">
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>通用贡献头衔</DialogTitle>
            <DialogDescription>
              这些头衔由成员贡献值对应的等级计算得出，会用于成员列表里的通用头衔显示。
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="max-h-[min(64vh,620px)] overflow-y-auto px-6 py-5">
            <div className="grid gap-3">
              {fields.map((field) => (
                <div
                  key={field.rankCode}
                  className="grid gap-3 border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] px-4 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,240px)] sm:items-center"
                >
                  <div className="grid gap-1">
                    <strong className="text-[#f2f7fb]">
                      {field.displayLabel}
                    </strong>
                    <span className="text-sm leading-6 text-[#9ab0c1]">
                      字段 {field.rankCode}
                      {typeof field.minimumContribution === 'number'
                        ? ` / 贡献值 ≥ ${field.minimumContribution}`
                        : ''}
                    </span>
                    <span className="text-sm leading-6 text-[#c7d6e2]">
                      默认值为 {field.defaultLabel}
                    </span>
                  </div>

                  {canManage ? (
                    <FieldGroup>
                      <TextInputField
                        label="显示名称"
                        value={
                          draftLabels[field.rankCode] ?? field.displayLabel
                        }
                        onChange={(event) => {
                          const nextValue = event.currentTarget.value;

                          setDraftLabels((current) => ({
                            ...current,
                            [field.rankCode]: nextValue,
                          }));
                        }}
                        disabled={isSubmitting}
                      />
                      <ActionButton
                        variant="secondary"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={() =>
                          setDraftLabels((current) => ({
                            ...current,
                            [field.rankCode]: field.defaultLabel,
                          }))
                        }
                      >
                        填入默认值
                      </ActionButton>
                    </FieldGroup>
                  ) : null}
                </div>
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
