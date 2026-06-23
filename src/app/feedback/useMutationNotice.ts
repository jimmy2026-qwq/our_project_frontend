import { useNotice } from '@/app/feedback/useNotice';

interface MutationResultLike {
  warning?: string;
}

interface MutationNoticeOptions {
  successTitle: string;
  successMessage: string;
  fallbackTitle: string;
  fallbackMessage: string;
}

export function useMutationNotice() {
  const { notifySuccess, notifyWarning } = useNotice();

  function notifyMutationResult(result: MutationResultLike, options: MutationNoticeOptions) {
    if (result.warning) {
      notifyWarning(options.fallbackTitle, result.warning ?? options.fallbackMessage);
      return;
    }

    notifySuccess(options.successTitle, options.successMessage);
  }

  return { notifyMutationResult };
}
