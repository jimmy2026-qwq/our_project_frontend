import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
  ConfirmationDialogContextValue,
  ConfirmDialogOptions,
} from './useConfirmationDialogContext';

interface PendingConfirmationRequest {
  options: ConfirmDialogOptions;
  resolve: (value: boolean) => void;
}

export function useQueuedConfirmationDialogState() {
  const [activeDialog, setActiveDialog] =
    useState<ConfirmDialogOptions | null>(null);
  const activeRequestRef = useRef<PendingConfirmationRequest | null>(null);
  const queuedRequestsRef = useRef<PendingConfirmationRequest[]>([]);
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
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    return () => {
      cancelButtonRef.current = null;
    };
  }, [activeDialog]);

  const contextValue = useMemo<ConfirmationDialogContextValue>(
    () => ({ confirm }),
    [confirm],
  );

  return {
    activeDialog,
    cancelButtonRef,
    closeDialog,
    contextValue,
  };
}
