import type { ConfirmDialogOptions } from './useConfirmationDialogContext';
import { useConfirmationDialogContext } from './useConfirmationDialogContext';

export function useConfirmationDialogActions() {
  const { confirm } = useConfirmationDialogContext();

  return {
    confirm: (options: ConfirmDialogOptions) => confirm(options),
    confirmDanger: (options: Omit<ConfirmDialogOptions, 'tone'>) =>
      confirm({
        ...options,
        tone: 'danger',
      }),
  };
}
