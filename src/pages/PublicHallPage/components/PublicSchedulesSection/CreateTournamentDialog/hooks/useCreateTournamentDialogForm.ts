import { type ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TournamentCreateAPI } from '@/api/tournament';
import { useAuth } from '@/app/auth/useAuth';
import { useNotice } from '@/app/feedback/useNotice';
import { DEFAULT_MAHJONG_RULESET } from '@/objects';
import type { TournamentFormat } from '@/objects/tournament';
import { sendAPI } from '@/system/api';

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

export function useCreateTournamentDialogForm({
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
  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canCreate =
    !!session?.user.roles.isSuperAdmin &&
    !!operatorId &&
    name.trim().length > 0 &&
    !isSubmitting;

  function reset() {
    setName('');
    setFormat('Swiss');
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }

  function handleFormatChange(event: ChangeEvent<HTMLSelectElement>) {
    setFormat(event.currentTarget.value as TournamentFormat);
  }

  function handleCancel() {
    onOpenChange(false);
  }

  async function handleSubmit() {
    if (!session?.user.roles.isSuperAdmin || !operatorId) {
      notifyWarning(
        '\u65e0\u6cd5\u521b\u5efa\u6bd4\u8d5b',
        '\u5f53\u524d\u8d26\u53f7\u6ca1\u6709\u521b\u5efa\u6bd4\u8d5b\u6240\u9700\u7684\u6743\u9650\u3002',
      );
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      notifyWarning(
        '\u8bf7\u586b\u5199\u8d5b\u4e8b\u540d\u79f0',
        '\u8d5b\u4e8b\u540d\u79f0\u4e0d\u80fd\u4e3a\u7a7a\u3002',
      );
      return;
    }

    const startsAt = new Date();
    const endsAt = new Date(startsAt.getTime() + 8 * 60 * 60 * 1000);

    try {
      setIsSubmitting(true);
      const tournament = await sendAPI(
        new TournamentCreateAPI({
          name: trimmedName,
          organizer: session.user.displayName || 'RiichiNexus',
          startsAt: startsAt.toISOString(),
          endsAt: endsAt.toISOString(),
          adminId: operatorId,
          stages: [
            {
              name: getDefaultStageName(trimmedName, format),
              format,
              order: 1,
              roundCount: getDefaultRoundCount(format),
              mahjongRuleset: DEFAULT_MAHJONG_RULESET,
              schedulingPoolSize: 4,
            },
          ],
        }),
      );
      const created = {
        id: tournament.tournamentId,
        name: tournament.name,
      };

      notifySuccess(
        '\u6bd4\u8d5b\u5df2\u521b\u5efa',
        `${created.name} \u5df2\u521b\u5efa\uff0c\u6b63\u5728\u8fdb\u5165\u8d5b\u4e8b\u8be6\u60c5\u9875\u3002`,
      );
      onOpenChange(false);
      navigate(`/public/tournaments/${created.id}`);
    } catch (error) {
      notifyWarning(
        '\u521b\u5efa\u6bd4\u8d5b\u5931\u8d25',
        error instanceof Error
          ? error.message
          : '\u521b\u5efa\u6bd4\u8d5b\u65f6\u53d1\u751f\u672a\u77e5\u9519\u8bef\u3002',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    adminName: session?.user.displayName ?? '',
    canCreate,
    format,
    handleCancel,
    handleFormatChange,
    handleNameChange,
    handleSubmit,
    isSubmitting,
    name,
    reset,
  };
}
