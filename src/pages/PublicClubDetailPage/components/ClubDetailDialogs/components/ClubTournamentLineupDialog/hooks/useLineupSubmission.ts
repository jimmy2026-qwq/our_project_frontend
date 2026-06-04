import { useState } from 'react';

import { TournamentStageSubmitLineupAPI } from '@/api/tournament';
import type { TournamentDetailView } from '@/objects/tournament';
import { sendAPI } from '@/system/api';

import type { ClubTournamentItem } from '../objects/ClubTournamentItem';

interface UseLineupSubmissionParams {
  clubId: string;
  operatorId: string;
  tournament: ClubTournamentItem | null;
  selectedStageId: string;
  selectedPlayerIds: string[];
  stageOptions: NonNullable<TournamentDetailView['stages']>;
  notifySuccess: (title: string, description?: string) => void;
  notifyWarning: (title: string, description?: string) => void;
}

export function useLineupSubmission({
  clubId,
  operatorId,
  tournament,
  selectedStageId,
  selectedPlayerIds,
  stageOptions,
  notifySuccess,
  notifyWarning,
}: UseLineupSubmissionParams) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLineup() {
    const effectiveStageId = selectedStageId || stageOptions[0]?.stageId || '';

    if (
      !tournament?.id ||
      !effectiveStageId ||
      selectedPlayerIds.length === 0
    ) {
      notifyWarning(
        '参赛名单未完成',
        '请选择阶段，并至少选择一名选手后再提交参赛名单。',
      );
      return false;
    }

    try {
      setIsSubmitting(true);
      await sendAPI(
        new TournamentStageSubmitLineupAPI(tournament.id, effectiveStageId, {
          clubId,
          operatorId,
          seats: selectedPlayerIds.map((playerId) => ({ playerId })),
        }),
      );
      notifySuccess(
        '参赛名单已提交',
        '本场赛事的参赛名单已经提交。',
      );
      return true;
    } catch (error) {
      notifyWarning(
        '参赛名单提交失败',
        error instanceof Error
          ? error.message
          : '参赛名单提交未完成，请稍后重试。',
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, submitLineup };
}
