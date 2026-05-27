import { useEffect, useState } from 'react';

import {
  ActionButton,
  FieldGroup,
  SelectField,
  TextareaField,
  TextInputField,
} from '@/components/ui';
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
import type { PlayerLeaderboardEntry } from '../../../objects/types';

import {
  type PlayerAdminAction,
  useManagePlayerDialogAction,
} from './hooks/useManagePlayerDialogAction';

export function ManagePlayerDialog({
  open,
  player,
  onOpenChange,
  onCompleted,
}: {
  open: boolean;
  player: PlayerLeaderboardEntry | null;
  onOpenChange: (open: boolean) => void;
  onCompleted?: () => void;
}) {
  const [action, setAction] = useState<PlayerAdminAction>('ban');
  const [reason, setReason] = useState('');
  const { canSubmit, isSubmitting, handleSubmit } =
    useManagePlayerDialogAction({
      open,
      player,
      action,
      reason,
      onOpenChange,
      onCompleted,
    });

  useEffect(() => {
    if (!open) {
      setAction('ban');
      setReason('');
    }
  }, [open]);

  useEffect(() => {
    setReason('');
  }, [player?.playerId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>管理玩家</DialogTitle>
            <DialogDescription>
              选择要执行的平台管理员操作，并确认目标玩家信息。
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            <FieldGroup>
              <TextInputField
                label="目标玩家"
                value={player?.nickname ?? ''}
                readOnly
              />
              <TextInputField
                label="玩家 ID"
                value={player?.playerId ?? ''}
                readOnly
              />
              <SelectField
                label="管理操作"
                value={action}
                onChange={(event) =>
                  setAction(event.currentTarget.value as PlayerAdminAction)
                }
                disabled={isSubmitting}
              >
                <option value="ban">封禁玩家</option>
                <option value="grantSuperAdmin">授权超管</option>
              </SelectField>
              {action === 'ban' ? (
                <TextareaField
                  label="封禁原因"
                  rows={4}
                  value={reason}
                  placeholder="请填写用于审计记录的封禁原因"
                  onChange={(event) => setReason(event.currentTarget.value)}
                  disabled={isSubmitting}
                />
              ) : null}
            </FieldGroup>
          </DialogBody>

          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <ActionButton
                onClick={() => void handleSubmit()}
                disabled={!canSubmit}
              >
                {isSubmitting
                  ? '提交中...'
                  : action === 'grantSuperAdmin'
                    ? '确认授权'
                    : '确认封禁'}
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
