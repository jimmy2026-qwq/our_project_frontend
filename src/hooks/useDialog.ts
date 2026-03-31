import type { ConfirmDialogOptions } from '@/providers/dialog-context';
import { useDialogContext } from '@/providers/dialog-context';

export function useDialog() {
  const { confirm } = useDialogContext();

  return {
    confirm: (options: ConfirmDialogOptions) => confirm(options),
  };
}
