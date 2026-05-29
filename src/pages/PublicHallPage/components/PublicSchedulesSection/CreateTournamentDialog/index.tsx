import {
  ActionButton,
  FieldGroup,
  SelectField,
  TextInputField,
} from '@/components/ui';
import {
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

import { useCreateTournamentDialogForm } from './hooks/useCreateTournamentDialogForm';

const LABEL_CREATE = '\u65b0\u5efa\u6bd4\u8d5b';
const LABEL_NAME = '\u8d5b\u4e8b\u540d\u79f0';
const LABEL_FORMAT = '\u8d5b\u5236';
const LABEL_ADMIN = '\u8d5b\u4e8b\u7ba1\u7406\u5458';
const LABEL_CANCEL = '\u53d6\u6d88';
const LABEL_SUBMIT = '\u521b\u5efa\u5e76\u8fdb\u5165\u8be6\u60c5';
const LABEL_SUBMITTING = '\u521b\u5efa\u4e2d...';
const FORMAT_SWISS = '\u745e\u58eb\u8f6e';
const FORMAT_KNOCKOUT = '\u6dd8\u6c70\u8d5b';

export function CreateTournamentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useCreateTournamentDialogForm({ open, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>{LABEL_CREATE}</DialogTitle>
            <DialogDescription>
              {
                '\u5148\u521b\u5efa\u6bd4\u8d5b\u57fa\u7840\u4fe1\u606f\u4e0e\u9996\u4e2a\u9636\u6bb5\u3002\u4ff1\u4e50\u90e8\u9080\u8bf7\u548c\u540e\u7eed\u8d5b\u7a0b\u914d\u7f6e\u7a0d\u540e\u518d\u8865\u3002'
              }
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            <FieldGroup>
              <TextInputField
                label={LABEL_NAME}
                value={form.name}
                placeholder={'\u4f8b\u5982\uff1a\u6625\u5b63\u516c\u5f00\u8d5b'}
                onChange={form.handleNameChange}
                disabled={form.isSubmitting}
              />
              <SelectField
                label={LABEL_FORMAT}
                value={form.format}
                onChange={form.handleFormatChange}
                disabled={form.isSubmitting}
              >
                <option value="Swiss">{FORMAT_SWISS}</option>
                <option value="Knockout">{FORMAT_KNOCKOUT}</option>
              </SelectField>
              <TextInputField
                label={LABEL_ADMIN}
                value={form.adminName}
                readOnly
              />
            </FieldGroup>
          </DialogBody>

          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <ActionButton
                onClick={() => void form.handleSubmit()}
                disabled={!form.canCreate}
              >
                {form.isSubmitting ? LABEL_SUBMITTING : LABEL_SUBMIT}
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={form.handleCancel}
                disabled={form.isSubmitting}
              >
                {LABEL_CANCEL}
              </ActionButton>
            </div>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
