import { createContext, useContext } from 'react';

export type ConfirmTone = 'default' | 'danger';

export interface ConfirmDialogOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
}

export interface ConfirmationDialogContextValue {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
}

export const ConfirmationDialogContext =
  createContext<ConfirmationDialogContextValue | null>(null);

export function useConfirmationDialogContext() {
  const context = useContext(ConfirmationDialogContext);

  if (!context) {
    throw new Error(
      'useConfirmationDialogContext must be used within ConfirmationDialogProvider.',
    );
  }

  return context;
}
