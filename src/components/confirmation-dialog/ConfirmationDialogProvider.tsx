import type { ReactNode } from 'react';

import {
  Button,
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
} from '@/components/ui';
import { ConfirmationDialogContext } from '@/components/confirmation-dialog/useConfirmationDialogContext';
import { useQueuedConfirmationDialogState } from './useQueuedConfirmationDialogState';

export function ConfirmationDialogProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { activeDialog, cancelButtonRef, closeDialog, contextValue } =
    useQueuedConfirmationDialogState();

  return (
    <ConfirmationDialogContext.Provider value={contextValue}>
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
            <DialogOverlay />
            <DialogSurface
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                cancelButtonRef.current?.focus();
              }}
            >
              <DialogBody className="p-[22px] pb-0 md:p-6 md:pb-0">
                <p className="m-0 text-[0.82rem] uppercase tracking-[0.16em] text-[#ecc57a]">
                  Confirm action
                </p>
                <DialogHeader>
                  <DialogTitle>{activeDialog.title}</DialogTitle>
                  {activeDialog.message ? (
                    <DialogDescription>
                      {activeDialog.message}
                    </DialogDescription>
                  ) : null}
                </DialogHeader>
              </DialogBody>
              <DialogFooter className="flex justify-end gap-3 border-t border-[rgba(176,223,229,0.14)] p-[22px] pt-4 md:p-6 md:pt-4">
                <Button
                  ref={cancelButtonRef}
                  variant="outline"
                  onClick={() => closeDialog(false)}
                >
                  {activeDialog.cancelText ?? 'Cancel'}
                </Button>
                <Button
                  variant={
                    activeDialog.tone === 'danger' ? 'danger' : 'default'
                  }
                  onClick={() => closeDialog(true)}
                >
                  {activeDialog.confirmText ?? 'Confirm'}
                </Button>
              </DialogFooter>
            </DialogSurface>
          </DialogPortal>
        ) : null}
      </Dialog>
    </ConfirmationDialogContext.Provider>
  );
}
