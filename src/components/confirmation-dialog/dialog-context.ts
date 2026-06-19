import { createContext, useContext } from 'react';

export type ConfirmTone = 'default' | 'danger';

export interface ConfirmDialogOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
}

export interface DialogContextValue {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

export const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialogContext must be used within DialogProvider.');
  }

  return context;
}
