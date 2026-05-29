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
        'Lineup is incomplete',
        'Select a stage and at least one player before submitting the lineup.',
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
        'Lineup submitted',
        'The tournament lineup has been submitted.',
      );
      return true;
    } catch (error) {
      notifyWarning(
        'Unable to submit lineup',
        error instanceof Error
          ? error.message
          : 'The lineup submission did not complete.',
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, submitLineup };
}
