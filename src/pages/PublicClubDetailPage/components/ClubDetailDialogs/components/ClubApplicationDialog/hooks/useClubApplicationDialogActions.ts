import type { Dispatch, SetStateAction } from 'react';

import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import { useNotice } from '@/app/feedback/useNotice';
import type { ClubApplication } from '@/pages/objects/ClubApplicationViews';

import type { HomeClubApplicationState } from '../../../../../objects/ClubApplication.types';
import { useClubApplicationMutations } from '../../../../../hooks/useClubApplicationMutations';

export function useClubApplicationDialogActions({
  onApplicationUpdated,
  onOpenChange,
  setState,
  state,
}: {
  onApplicationUpdated?: (status: ClubApplication['status'] | null) => void;
  onOpenChange: (open: boolean) => void;
  setState: Dispatch<SetStateAction<HomeClubApplicationState | null>>;
  state: HomeClubApplicationState | null;
}) {
  const { submitClubApplication, withdrawClubApplication } =
    useClubApplicationMutations();
  const { notifyMutationResult } = useMutationNotice();
  const { notifyWarning } = useNotice();

  async function handleSubmit() {
    if (!state) {
      return;
    }

    try {
      const result = await submitClubApplication(state);
      setState((current) =>
        current
          ? {
              ...current,
              application: {
                application: result.application,
                source: result.source,
                warning: result.warning,
              },
            }
          : current,
      );
      notifyMutationResult(result, {
        successTitle: '申请已提交',
        successMessage: '俱乐部申请已经成功发送到后端。',
        fallbackTitle: '申请需要人工确认',
        fallbackMessage: '这次申请未能完全确认，请稍后刷新状态。',
      });
      onApplicationUpdated?.(result.application.status);
      onOpenChange(false);
    } catch (error) {
      notifyWarning(
        '申请提交失败',
        error instanceof Error ? error.message : '无法提交当前俱乐部申请。',
      );
    }
  }

  async function handleWithdraw() {
    if (!state) {
      return;
    }

    try {
      const result = await withdrawClubApplication(state);
      setState((current) =>
        current
          ? {
              ...current,
              application: {
                application: result.application,
                source: result.source,
                warning: result.warning,
              },
            }
          : current,
      );
      notifyMutationResult(result, {
        successTitle: '申请已撤回',
        successMessage: '撤回请求已经处理完成。',
        fallbackTitle: '撤回需要人工确认',
        fallbackMessage: '这次撤回未能完全确认，请稍后刷新状态。',
      });
      onApplicationUpdated?.(result.application.status);
    } catch (error) {
      notifyWarning(
        '撤回失败',
        error instanceof Error ? error.message : '无法撤回当前申请。',
      );
    }
  }

  return { handleSubmit, handleWithdraw };
}
