import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import { useNotice } from '@/app/feedback/useNotice';
import { ApiError } from '@/system/api/http';

export interface TableActionNoticeOptions {
  successTitle: string;
  successMessage: string;
  fallbackTitle: string;
  fallbackMessage: string;
}

interface TableActionRunnerParams {
  onRefresh: () => void;
  setActionError: (message: string | null) => void;
  setIsSubmittingAction: (value: boolean) => void;
}

export function useTableActionRunner({
  onRefresh,
  setActionError,
  setIsSubmittingAction,
}: TableActionRunnerParams) {
  const { notifyMutationResult } = useMutationNotice();
  const { notifyWarning } = useNotice();

  async function runTableAction(
    action: () => Promise<unknown>,
    options: TableActionNoticeOptions,
  ) {
    try {
      setIsSubmittingAction(true);
      setActionError(null);
      await action();
      notifyMutationResult({ source: 'api' }, options);
      onRefresh();
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Tournament operation failed.';
      setActionError(message);

      if (!(error instanceof ApiError)) {
        notifyWarning(options.fallbackTitle, message);
      }

      return false;
    } finally {
      setIsSubmittingAction(false);
    }
  }

  return { runTableAction };
}
