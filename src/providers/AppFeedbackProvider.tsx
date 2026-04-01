import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { Alert, AlertDescription, AlertTitle, Button } from '@/components/ui';
import {
  AppFeedbackContext,
  type AppFeedbackContextValue,
  type AppNoticeInput,
  type NoticeTone,
} from '@/providers/app-feedback-context';

interface AppNotice extends AppNoticeInput {
  id: number;
  tone: NoticeTone;
}

function getNoticeVariant(tone: NoticeTone) {
  switch (tone) {
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    default:
      return 'default';
  }
}

function NoticeStack({
  notices,
  onDismiss,
}: {
  notices: AppNotice[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="app-notice-stack fixed bottom-[18px] right-[18px] z-20 grid w-[min(360px,calc(100vw-24px))] gap-3" aria-live="polite" aria-label="Application notices">
      {notices.map((notice) => (
        <Alert
          key={notice.id}
          variant={getNoticeVariant(notice.tone)}
          className="app-notice grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-[color:var(--line)] bg-[rgba(7,18,28,0.94)] shadow-[var(--shadow-md)] backdrop-blur-[18px]"
        >
          <div className="app-notice__body grid gap-[6px]">
            <AlertTitle>{notice.title}</AlertTitle>
            {notice.message ? <AlertDescription>{notice.message}</AlertDescription> : null}
          </div>
          <Button
            type="button"
            className="app-notice__dismiss self-start"
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(notice.id)}
            aria-label="Dismiss notice"
          >
            Dismiss
          </Button>
        </Alert>
      ))}
    </div>
  );
}

export function AppFeedbackProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<AppNotice[]>([]);
  const nextId = useRef(1);
  const dismissTimeoutsRef = useRef(new Map<number, number>());

  const removeNotice = useCallback((id: number) => {
    const timeout = dismissTimeoutsRef.current.get(id);

    if (timeout) {
      window.clearTimeout(timeout);
      dismissTimeoutsRef.current.delete(id);
    }

    setNotices((current) => current.filter((notice) => notice.id !== id));
  }, []);

  const pushNotice = useCallback(
    ({ title, message, tone = 'info' }: AppNoticeInput) => {
      const id = nextId.current++;
      setNotices((current) => [...current, { id, title, message, tone }]);

      const timeout = window.setTimeout(() => {
        removeNotice(id);
      }, 4000);

      dismissTimeoutsRef.current.set(id, timeout);
    },
    [removeNotice],
  );

  useEffect(() => {
    return () => {
      dismissTimeoutsRef.current.forEach((timeout) => {
        window.clearTimeout(timeout);
      });
      dismissTimeoutsRef.current.clear();
    };
  }, []);

  const value = useMemo<AppFeedbackContextValue>(() => ({ pushNotice }), [pushNotice]);

  return (
    <AppFeedbackContext.Provider value={value}>
      {children}
      <NoticeStack notices={notices} onDismiss={removeNotice} />
    </AppFeedbackContext.Provider>
  );
}
