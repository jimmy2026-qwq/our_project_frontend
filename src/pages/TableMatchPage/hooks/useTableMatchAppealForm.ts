import { useState } from 'react';

import { AppealFileAPI } from '@/api/tournament';
import { useNotice } from '@/app/feedback/useNotice';
import type { TableDetail } from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';
import { ApiError } from '@/system/api/http';

import type { TableSeat } from '../objects/TableMatch.types';

interface TableMatchAppealFormParams {
  table: TableDetail | null;
  ownSeat: TableSeat | null;
  operatorId: string;
  forceReload: () => void;
}

export function useTableMatchAppealForm({
  table,
  ownSeat,
  operatorId,
  forceReload,
}: TableMatchAppealFormParams) {
  const { notifyWarning, notifyInfo, notifySuccess } = useNotice();
  const [isAppealDialogOpen, setIsAppealDialogOpen] = useState(false);
  const [appealDescription, setAppealDescription] = useState('');
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const [appealError, setAppealError] = useState<string | null>(null);

  function openAppealDialog() {
    setAppealError(null);
    setIsAppealDialogOpen(true);
  }

  function setAppealDialogOpen(open: boolean) {
    setIsAppealDialogOpen(open);
    if (!open) {
      setAppealError(null);
    }
  }

  async function handleSubmitAppeal() {
    if (!table || !operatorId || !ownSeat) {
      notifyInfo(
        '暂时无法提交申诉',
        '请使用本桌参赛玩家账号进入牌桌后再提交申诉。',
      );
      return;
    }

    const description = appealDescription.trim();
    if (!description) {
      setAppealError('请先填写申诉说明。');
      return;
    }

    try {
      setIsSubmittingAppeal(true);
      setAppealError(null);
      await sendAPI(new AppealFileAPI(table.id, { playerId: operatorId, description }));
      setAppealDescription('');
      setIsAppealDialogOpen(false);
      notifySuccess(
        '申诉已提交',
        `牌桌 ${String(table.tableNo).padStart(2, '0')} 的申诉工单已经创建。`,
      );
      forceReload();
    } catch (error) {
      const message = getAppealErrorMessage(error);
      setAppealError(message);

      if (!(error instanceof ApiError)) {
        notifyWarning('提交申诉失败', message);
      }
    } finally {
      setIsSubmittingAppeal(false);
    }
  }

  return {
    isAppealDialogOpen,
    appealDescription,
    appealError,
    isSubmittingAppeal,
    openAppealDialog,
    setAppealDialogOpen,
    setAppealDescription,
    handleSubmitAppeal,
  };
}

function getAppealErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '提交申诉失败，请稍后重试。';
}
