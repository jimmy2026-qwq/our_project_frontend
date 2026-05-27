import { useEffect, useState } from 'react';

import {
  PlatformAdminBanPlayerAPI,
  PlatformAdminGrantSuperAdminAPI,
} from '@/api/platformadmin';
import { useAuth } from '@/app/auth/useAuth';
import { useNotice } from '@/app/feedback/useNotice';
import type { PlayerLeaderboardEntry } from '../../../../objects/types';
import { sendAPI } from '@/system/api';

export type PlayerAdminAction = 'ban' | 'grantSuperAdmin';

export function useManagePlayerDialogAction({
  open,
  player,
  action,
  reason,
  onOpenChange,
  onCompleted,
}: {
  open: boolean;
  player: PlayerLeaderboardEntry | null;
  action: PlayerAdminAction;
  reason: string;
  onOpenChange: (open: boolean) => void;
  onCompleted?: () => void;
}) {
  const { session } = useAuth();
  const { notifySuccess, notifyWarning } = useNotice();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const operatorId = session?.user.operatorId ?? '';
  const trimmedReason = reason.trim();
  const canSubmit =
    !!player &&
    !!operatorId &&
    !isSubmitting &&
    (action === 'grantSuperAdmin' || trimmedReason.length > 0);

  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
    }
  }, [open]);

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
        await sendAPI(
          new PlatformAdminGrantSuperAdminAPI(player.playerId, { operatorId }),
        );
        notifySuccess('已授权超管', `${player.nickname} 已获得平台超管权限。`);
      } else {
        await sendAPI(
          new PlatformAdminBanPlayerAPI(player.playerId, {
            operatorId,
            reason: trimmedReason,
          }),
        );
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

  return {
    canSubmit,
    isSubmitting,
    handleSubmit,
  };
}
