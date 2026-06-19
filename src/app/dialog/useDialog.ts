import type { ConfirmDialogOptions } from '@/components/confirmation-dialog/dialog-context';
import { useDialogContext } from '@/components/confirmation-dialog/dialog-context';

export function useDialog() {
  const { confirm } = useDialogContext();

  return {
    confirm: (options: ConfirmDialogOptions) => confirm(options),
    confirmDanger: (options: Omit<ConfirmDialogOptions, 'tone'>) =>
      confirm({
        ...options,
        tone: 'danger',
      }),
  };
}
