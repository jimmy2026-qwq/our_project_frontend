import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

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

function NoticeStack({
  notices,
  onDismiss,
}: {
  notices: AppNotice[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="app-notice-stack" aria-live="polite" aria-label="Application notices">
      {notices.map((notice) => (
        <article key={notice.id} className={`app-notice app-notice--${notice.tone}`}>
          <div className="app-notice__body">
            <strong>{notice.title}</strong>
            {notice.message ? <p>{notice.message}</p> : null}
          </div>
          <button type="button" className="app-notice__dismiss" onClick={() => onDismiss(notice.id)} aria-label="Dismiss notice">
            Dismiss
          </button>
        </article>
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
