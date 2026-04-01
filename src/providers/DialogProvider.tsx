import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { Button, Dialog, DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogSurface, DialogTitle } from '@/components/ui';
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

    return () => {
      cancelButtonRef.current = null;
    };
  }, [activeDialog]);

  const value = useMemo<DialogContextValue>(() => ({ confirm }), [confirm]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Dialog
        open={Boolean(activeDialog)}
        onOpenChange={(open) => {
          if (!open && activeDialog) {
            closeDialog(false);
          }
        }}
      >
        {activeDialog ? (
          <DialogPortal>
            <DialogOverlay className="app-dialog-backdrop" />
            <DialogSurface
              className="app-dialog"
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                cancelButtonRef.current?.focus();
              }}
            >
              <DialogBody className="app-dialog__body p-[22px] pb-0 md:p-6 md:pb-0">
                <p className="eyebrow">Confirm action</p>
                <DialogHeader>
                  <DialogTitle>{activeDialog.title}</DialogTitle>
                  {activeDialog.message ? <DialogDescription>{activeDialog.message}</DialogDescription> : null}
                </DialogHeader>
              </DialogBody>
              <DialogFooter className="app-dialog__actions flex justify-end gap-3 border-t border-[color:var(--line)] p-[22px] pt-4 md:p-6 md:pt-4">
                <Button
                  ref={cancelButtonRef}
                  variant="outline"
                  onClick={() => closeDialog(false)}
                >
                  {activeDialog.cancelText ?? 'Cancel'}
                </Button>
                <Button
                  variant={activeDialog.tone === 'danger' ? 'danger' : 'default'}
                  onClick={() => closeDialog(true)}
                >
                  {activeDialog.confirmText ?? 'Confirm'}
                </Button>
              </DialogFooter>
            </DialogSurface>
          </DialogPortal>
        ) : null}
      </Dialog>
    </DialogContext.Provider>
  );
}
