import { useNotice } from '@/hooks/useNotice';

interface MutationResultLike {
  source?: 'api' | 'mock';
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
    if (result.source === 'api') {
      notifySuccess(options.successTitle, options.successMessage);
      return;
    }

    notifyWarning(options.fallbackTitle, result.warning ?? options.fallbackMessage);
  }

  return { notifyMutationResult };
}
