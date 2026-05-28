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
  SelectField,
} from '@/components/ui';

import { participantText } from '../objects/TournamentDetailParticipantsText';

export function InviteParticipantDialog({
  open,
  title,
  description,
  label,
  value,
  options,
  isSubmitting,
  emptyLabel,
  onValueChange,
  onSubmit,
  onOpenChange,
}: {
  open: boolean;
  title: string;
  description: string;
  label: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  isSubmitting: boolean;
  emptyLabel: string;
  onValueChange: (value: string) => void;
  onSubmit: () => Promise<void> | void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface className="max-w-[min(680px,92vw)]">
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4 px-6 py-5">
            <SelectField
              label={label}
              value={value}
              onChange={(event) => onValueChange(event.currentTarget.value)}
              disabled={isSubmitting || options.length === 0}
            >
              {options.length > 0 ? (
                options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))
              ) : (
                <option value="">{emptyLabel}</option>
              )}
            </SelectField>
          </DialogBody>
          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {participantText.close}
            </Button>
            <Button
              onClick={() => void onSubmit()}
              disabled={isSubmitting || !value || options.length === 0}
            >
              {isSubmitting
                ? participantText.inviting
                : participantText.confirmInvite}
            </Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
