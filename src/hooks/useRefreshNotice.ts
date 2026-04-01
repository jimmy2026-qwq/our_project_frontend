import { useNotice } from '@/hooks/useNotice';

interface RefreshPayloadLike {
  source?: 'api' | 'mock';
  warning?: string;
}

interface RefreshNoticeOptions {
  failureTitle: string;
  successTitle: string;
  successMessage: string;
  fallbackTitle: string;
  fallbackMessage: string;
}

export function useRefreshNotice() {
  const { notifySuccess, notifyWarning } = useNotice();

  function notifyRefreshResult(
    payloads: Array<RefreshPayloadLike | null | undefined>,
    options: RefreshNoticeOptions,
    error?: string | null,
  ) {
    if (error) {
      notifyWarning(options.failureTitle, error);
      return;
    }

    const warnings = payloads.map((payload) => payload?.warning).filter(Boolean);
    const hasFallback = payloads.some((payload) => payload?.source === 'mock');

    if (hasFallback) {
      notifyWarning(options.fallbackTitle, warnings[0] ?? options.fallbackMessage);
      return;
    }

    notifySuccess(options.successTitle, options.successMessage);
  }

  return { notifyRefreshResult };
}
