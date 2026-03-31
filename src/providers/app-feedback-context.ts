import { createContext, useContext } from 'react';

export type NoticeTone = 'info' | 'success' | 'warning';

export interface AppNoticeInput {
  title: string;
  message?: string;
  tone?: NoticeTone;
}

export interface AppFeedbackContextValue {
  pushNotice: (notice: AppNoticeInput) => void;
}

export const AppFeedbackContext = createContext<AppFeedbackContextValue | null>(null);

export function useAppFeedbackContext() {
  const context = useContext(AppFeedbackContext);

  if (!context) {
    throw new Error('useAppFeedbackContext must be used within AppFeedbackProvider.');
  }

  return context;
}
