import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';

import { DialogContext, type ConfirmDialogOptions, type DialogContextValue } from '@/providers/dialog-context';

interface PendingDialogRequest {
  options: ConfirmDialogOptions;
  resolve: (value: boolean) => void;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [activeDialog, setActiveDialog] = useState<ConfirmDialogOptions | null>(null);
  const activeRequestRef = useRef<PendingDialogRequest | null>(null);
  const queuedRequestsRef = useRef<PendingDialogRequest[]>([]);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  const flushNextDialog = useCallback(() => {
    if (activeRequestRef.current || queuedRequestsRef.current.length === 0) {
      return;
    }

    const nextRequest = queuedRequestsRef.current.shift() ?? null;

    if (!nextRequest) {
      return;
    }

    activeRequestRef.current = nextRequest;
    setActiveDialog(nextRequest.options);
  }, []);

  const closeDialog = useCallback(
    (result: boolean) => {
      activeRequestRef.current?.resolve(result);
      activeRequestRef.current = null;
      setActiveDialog(null);

      const elementToRestore = previousFocusedElementRef.current;
      previousFocusedElementRef.current = null;

      window.setTimeout(() => {
        elementToRestore?.focus();
        flushNextDialog();
      }, 0);
    },
    [flushNextDialog],
  );

  const confirm = useCallback(
    (options: ConfirmDialogOptions) => {
      return new Promise<boolean>((resolve) => {
        queuedRequestsRef.current.push({ options, resolve });
        flushNextDialog();
      });
    },
    [flushNextDialog],
  );

  useEffect(() => {
    return () => {
      activeRequestRef.current?.resolve(false);
      activeRequestRef.current = null;

      for (const request of queuedRequestsRef.current) {
        request.resolve(false);
      }

      queuedRequestsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!activeDialog) {
      return;
    }

    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const frame = window.requestAnimationFrame(() => {
      cancelButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeDialog, closeDialog]);

  const value = useMemo<DialogContextValue>(() => ({ confirm }), [confirm]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      {activeDialog ? (
        <div className="app-dialog-backdrop" role="presentation" onClick={() => closeDialog(false)}>
          <div
            className="app-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="app-dialog__body">
              <p className="eyebrow">Confirm action</p>
              <h2 id={titleId}>{activeDialog.title}</h2>
              {activeDialog.message ? <p>{activeDialog.message}</p> : null}
            </div>
            <div className="app-dialog__actions">
              <button
                ref={cancelButtonRef}
                type="button"
                className="app-dialog__button"
                onClick={() => closeDialog(false)}
              >
                {activeDialog.cancelText ?? 'Cancel'}
              </button>
              <button
                type="button"
                className={`app-dialog__button app-dialog__button--${activeDialog.tone ?? 'default'}`}
                onClick={() => closeDialog(true)}
              >
                {activeDialog.confirmText ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DialogContext.Provider>
  );
}
