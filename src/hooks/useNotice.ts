import type { AppNoticeInput } from '@/providers/app-feedback-context';
import { useAppFeedbackContext } from '@/providers/app-feedback-context';

export function useNotice() {
  const { pushNotice } = useAppFeedbackContext();

  return {
    notify: (notice: AppNoticeInput) => pushNotice(notice),
    notifyInfo: (title: string, message?: string) => pushNotice({ title, message, tone: 'info' }),
    notifySuccess: (title: string, message?: string) => pushNotice({ title, message, tone: 'success' }),
    notifyWarning: (title: string, message?: string) => pushNotice({ title, message, tone: 'warning' }),
  };
}
