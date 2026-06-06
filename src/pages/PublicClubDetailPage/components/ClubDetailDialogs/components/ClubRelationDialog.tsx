import { useEffect, useMemo, useState } from 'react';

import { ListPublicClubsAPI } from '@/api/club';
import {
  ActionButton,
  Alert,
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
  SelectField,
  TextareaField,
} from '@/components/ui';
import type {
  ClubRelationKind,
  PublicClubDirectoryEntry,
} from '@/objects/club';
import { sendAPI } from '@/system/api';

import type { ClubRelationDraft } from '../../ClubDetailContent/hooks/useClubRelationActions';

const relationOptions: Array<{ value: ClubRelationKind; label: string }> = [
  { value: 'Alliance', label: '联盟' },
  { value: 'Rivalry', label: '对抗' },
  { value: 'Neutral', label: '中立' },
];

export function ClubRelationDialog({
  clubId,
  mode,
  open,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: {
  clubId: string;
  mode: 'manage' | 'request';
  open: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: ClubRelationDraft) => Promise<void>;
}) {
  const [clubs, setClubs] = useState<PublicClubDirectoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [targetClubId, setTargetClubId] = useState('');
  const [relation, setRelation] = useState<ClubRelationKind>('Alliance');
  const [note, setNote] = useState('');
  const selectableClubs = useMemo(
    () => clubs.filter((club) => club.clubId !== clubId),
    [clubId, clubs],
  );
  const canSubmit =
    !isSubmitting &&
    !isLoading &&
    targetClubId.trim().length > 0 &&
    targetClubId !== clubId;
  const isRequestMode = mode === 'request';

  useEffect(() => {
    if (!open) {
      setTargetClubId('');
      setRelation('Alliance');
      setNote('');
      setLoadError('');
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError('');

    void sendAPI(new ListPublicClubsAPI({ limit: 100, offset: 0 }))
      .then((response) => {
        if (cancelled) {
          return;
        }

        const nextClubs = response.items ?? [];
        const firstTarget = nextClubs.find((club) => club.clubId !== clubId);

        setClubs(nextClubs);
        setTargetClubId((current) =>
          current && current !== clubId ? current : firstTarget?.clubId ?? '',
        );
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : '俱乐部列表读取失败，请稍后重试。',
        );
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clubId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>
              {isRequestMode ? '申请关系调整' : '管理俱乐部关系'}
            </DialogTitle>
            <DialogDescription>
              {isRequestMode
                ? '申请会发送给平台超管审核，不会直接修改公开关系。'
                : '设置后会同步更新两家俱乐部的公开关系。'}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            <FieldGroup>
              {loadError ? (
                <Alert variant="warning">{loadError}</Alert>
              ) : null}
              <SelectField
                label="目标俱乐部"
                value={targetClubId}
                onChange={(event) => setTargetClubId(event.currentTarget.value)}
                disabled={isLoading || isSubmitting || selectableClubs.length === 0}
              >
                {selectableClubs.length === 0 ? (
                  <option value="">暂无可选俱乐部</option>
                ) : null}
                {selectableClubs.map((club) => (
                  <option key={club.clubId} value={club.clubId}>
                    {club.name}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="关系"
                value={relation}
                onChange={(event) =>
                  setRelation(event.currentTarget.value as ClubRelationKind)
                }
                disabled={isSubmitting}
              >
                {relationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
              <TextareaField
                label="备注"
                value={note}
                rows={3}
                placeholder="可选"
                onChange={(event) => setNote(event.currentTarget.value)}
                disabled={isSubmitting}
              />
            </FieldGroup>
          </DialogBody>

          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <ActionButton
                onClick={() =>
                  void onSubmit({
                    targetClubId,
                    relation,
                    note,
                  })
                }
                disabled={!canSubmit}
              >
                {isSubmitting
                  ? '提交中...'
                  : isRequestMode
                    ? '提交申请'
                    : '确认更新'}
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
