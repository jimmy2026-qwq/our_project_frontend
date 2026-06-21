import { useEffect, useMemo, useState } from 'react';

import { ListPublicClubsAPI } from '@/api/club';
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
  ClubRelationKind,
  PublicClubDirectoryEntry,
} from '@/objects/club';
import { ClubRelationKinds } from '@/objects/club';
import { sendAPI } from '@/system/api';

import type { ClubRelationDraft } from '../../ClubDetailContent/hooks/useClubRelationActions';
import { ClubRelationDialogFields } from './ClubRelationDialogFields';

/** 提交或更新俱乐部对外关系的弹窗。 */
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
  const [relation, setRelation] = useState<ClubRelationKind>(
    ClubRelationKinds.Alliance,
  );
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
      setRelation(ClubRelationKinds.Alliance);
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
            <ClubRelationDialogFields
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              loadError={loadError}
              note={note}
              relation={relation}
              selectableClubs={selectableClubs}
              targetClubId={targetClubId}
              onNoteChange={setNote}
              onRelationChange={setRelation}
              onTargetClubIdChange={setTargetClubId}
            />
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
