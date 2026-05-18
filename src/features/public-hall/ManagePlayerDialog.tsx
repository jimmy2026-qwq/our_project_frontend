import { useEffect, useState } from 'react';

import { platformAdminApi } from '@/api/platformadmin';
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
import { useAuth, useNotice } from '@/hooks';
import type { PlayerLeaderboardEntry } from '@/objects/publicquery';

type PlayerAdminAction = 'ban' | 'grantSuperAdmin';

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
  const { session } = useAuth();
  const { notifySuccess, notifyWarning } = useNotice();
  const [action, setAction] = useState<PlayerAdminAction>('ban');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setAction('ban');
      setReason('');
      setIsSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    setReason('');
  }, [player?.playerId]);

  const operatorId = session?.user.operatorId ?? '';
  const trimmedReason = reason.trim();
  const canSubmit =
    !!player &&
    !!operatorId &&
    !isSubmitting &&
    (action === 'grantSuperAdmin' || trimmedReason.length > 0);

  async function handleSubmit() {
    if (!player || !operatorId) {
      notifyWarning(
        '无法管理玩家',
        '当前账号缺少平台管理员操作所需的玩家身份。',
      );
      return;
    }

    if (action === 'ban' && !trimmedReason) {
      notifyWarning('请填写封禁原因', '封禁玩家时需要留下审计原因。');
      return;
    }

    try {
      setIsSubmitting(true);

      if (action === 'grantSuperAdmin') {
        await platformAdminApi.grantSuperAdmin(player.playerId, { operatorId });
        notifySuccess('已授权超管', `${player.nickname} 已获得平台超管权限。`);
      } else {
        await platformAdminApi.banPlayer(player.playerId, {
          operatorId,
          reason: trimmedReason,
        });
        notifySuccess('已封禁玩家', `${player.nickname} 已被封禁。`);
      }

      onCompleted?.();
      onOpenChange(false);
    } catch (error) {
      notifyWarning(
        '玩家管理操作失败',
        error instanceof Error
          ? error.message
          : '提交玩家管理操作时发生未知错误。',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[color:var(--line)] px-6 py-5">
            <DialogTitle>管理玩家</DialogTitle>
            <DialogDescription>
              选择要执行的平台管理员操作，并确认目标玩家信息。
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            <FieldGroup className="guest-flow__form">
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

          <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5">
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
