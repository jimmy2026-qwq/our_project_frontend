import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { operationsApi, type TournamentFormat } from '@/api/operations';
import { FieldGroup, SelectField, TextInputField } from '@/components/shared/forms';
import { ActionButton } from '@/components/shared/layout';
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
import { useAuth, useNotice } from '@/hooks';

const LABEL_CREATE = '\u65b0\u5efa\u6bd4\u8d5b';
const LABEL_NAME = '\u8d5b\u4e8b\u540d\u79f0';
const LABEL_FORMAT = '\u8d5b\u5236';
const LABEL_ADMIN = '\u8d5b\u4e8b\u7ba1\u7406\u5458';
const LABEL_CANCEL = '\u53d6\u6d88';
const LABEL_SUBMIT = '\u521b\u5efa\u5e76\u8fdb\u5165\u8be6\u60c5';
const LABEL_SUBMITTING = '\u521b\u5efa\u4e2d...';
const FORMAT_SWISS = '\u745e\u58eb\u8f6e';
const FORMAT_KNOCKOUT = '\u6dd8\u6c70\u8d5b';

function getDefaultStageName(name: string, format: TournamentFormat) {
  const trimmedName = name.trim();
  const suffix = format === 'Swiss' ? FORMAT_SWISS : FORMAT_KNOCKOUT;

  if (!trimmedName) {
    return `${suffix}\u9636\u6bb5`;
  }

  return `${trimmedName} ${suffix}`;
}

function getDefaultRoundCount(format: TournamentFormat) {
  return format === 'Swiss' ? 4 : 3;
}

export function CreateTournamentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { notifySuccess, notifyWarning } = useNotice();
  const [name, setName] = useState('');
  const [format, setFormat] = useState<TournamentFormat>('Swiss');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setName('');
      setFormat('Swiss');
      setIsSubmitting(false);
    }
  }, [open]);

  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canCreate = !!session?.user.roles.isSuperAdmin && !!operatorId && name.trim().length > 0 && !isSubmitting;

  async function handleSubmit() {
    if (!session?.user.roles.isSuperAdmin || !operatorId) {
      notifyWarning('\u65e0\u6cd5\u521b\u5efa\u6bd4\u8d5b', '\u5f53\u524d\u8d26\u53f7\u6ca1\u6709\u521b\u5efa\u6bd4\u8d5b\u6240\u9700\u7684\u6743\u9650\u3002');
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      notifyWarning('\u8bf7\u586b\u5199\u8d5b\u4e8b\u540d\u79f0', '\u8d5b\u4e8b\u540d\u79f0\u4e0d\u80fd\u4e3a\u7a7a\u3002');
      return;
    }

    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + 8 * 60 * 60 * 1000);

    try {
      setIsSubmitting(true);
      const created = await operationsApi.createTournament({
        name: trimmedName,
        organizer: session.user.displayName || 'RiichiNexus',
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        adminId: operatorId,
        stage: {
          name: getDefaultStageName(trimmedName, format),
          format,
          roundCount: getDefaultRoundCount(format),
          schedulingPoolSize: 4,
        },
      });

      notifySuccess('\u6bd4\u8d5b\u5df2\u521b\u5efa', `${created.name} \u5df2\u521b\u5efa\uff0c\u6b63\u5728\u8fdb\u5165\u8d5b\u4e8b\u8be6\u60c5\u9875\u3002`);
      onOpenChange(false);
      navigate(`/public/tournaments/${created.id}`);
    } catch (error) {
      notifyWarning(
        '\u521b\u5efa\u6bd4\u8d5b\u5931\u8d25',
        error instanceof Error ? error.message : '\u521b\u5efa\u6bd4\u8d5b\u65f6\u53d1\u751f\u672a\u77e5\u9519\u8bef\u3002',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[color:var(--line)] px-6 py-5">
            <DialogTitle>{LABEL_CREATE}</DialogTitle>
            <DialogDescription>
              {'\u5148\u521b\u5efa\u6bd4\u8d5b\u57fa\u7840\u4fe1\u606f\u4e0e\u9996\u4e2a\u9636\u6bb5\u3002\u4ff1\u4e50\u90e8\u9080\u8bf7\u548c\u540e\u7eed\u8d5b\u7a0b\u914d\u7f6e\u7a0d\u540e\u518d\u8865\u3002'}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            <FieldGroup className="guest-flow__form">
              <TextInputField
                label={LABEL_NAME}
                value={name}
                placeholder={'\u4f8b\u5982\uff1a\u6625\u5b63\u516c\u5f00\u8d5b'}
                onChange={(event) => setName(event.currentTarget.value)}
                disabled={isSubmitting}
              />
              <SelectField
                label={LABEL_FORMAT}
                value={format}
                onChange={(event) => setFormat(event.currentTarget.value as TournamentFormat)}
                disabled={isSubmitting}
              >
                <option value="Swiss">{FORMAT_SWISS}</option>
                <option value="Knockout">{FORMAT_KNOCKOUT}</option>
              </SelectField>
              <TextInputField label={LABEL_ADMIN} value={session?.user.displayName ?? ''} readOnly />
            </FieldGroup>
          </DialogBody>

          <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5">
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <ActionButton onClick={() => void handleSubmit()} disabled={!canCreate}>
                {isSubmitting ? LABEL_SUBMITTING : LABEL_SUBMIT}
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                {LABEL_CANCEL}
              </ActionButton>
            </div>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
