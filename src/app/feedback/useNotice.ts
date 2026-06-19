import { useCallback, useMemo } from 'react';

import type { AppNoticeInput } from '@/app/feedback/app-feedback-context';
import { useAppFeedbackContext } from '@/app/feedback/app-feedback-context';

export function useNotice() {
  const { pushNotice } = useAppFeedbackContext();

  const notify = useCallback(
    (notice: AppNoticeInput) => pushNotice(notice),
    [pushNotice],
  );
  const notifyInfo = useCallback(
    (title: string, message?: string) =>
      pushNotice({ title, message, tone: 'info' }),
    [pushNotice],
  );
  const notifySuccess = useCallback(
    (title: string, message?: string) =>
      pushNotice({ title, message, tone: 'success' }),
    [pushNotice],
  );
  const notifyWarning = useCallback(
    (title: string, message?: string) =>
      pushNotice({ title, message, tone: 'warning' }),
    [pushNotice],
  );

  return useMemo(
    () => ({
      notify,
      notifyInfo,
      notifySuccess,
      notifyWarning,
    }),
    [notify, notifyInfo, notifySuccess, notifyWarning],
  );
}
