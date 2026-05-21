import { tournamentApi } from '@/pages/PublicHall/objects/data.transport';
import { useNotice } from '@/app/feedback/useNotice';
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
} from '@/components/ui';

import { useClubTournamentLineupWorkbench } from '../hooks/ClubTournamentLineupDialog.hooks';
import {
  ClubTournamentLineupBody,
  ClubTournamentLineupFooter,
  ClubTournamentLineupHeader,
} from './ClubTournamentLineupDialog.panels';
import type { ClubTournamentItem } from '../objects/ClubTournamentLineupDialog.types';

export function ClubTournamentLineupDialog({
  clubId,
  operatorId,
  tournament,
  open,
  onOpenChange,
}: {
  clubId: string;
  operatorId: string;
  tournament: ClubTournamentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { notifySuccess, notifyWarning } = useNotice();
  const {
    workbench,
    setIsSubmitting,
    setSelectedStageId,
    setStatusFilter,
    setEloSort,
    togglePlayer,
    notifyWarning: notifyWorkbenchWarning,
  } = useClubTournamentLineupWorkbench({
    clubId,
    operatorId,
    tournament,
    open,
  });

  async function handleSubmit() {
    const effectiveStageId =
      workbench.selectedStageId || workbench.stageOptions[0]?.stageId || '';

    if (
      !tournament?.id ||
      !effectiveStageId ||
      workbench.selectedPlayerIds.length === 0
    ) {
      notifyWorkbenchWarning(
        'Lineup is incomplete',
        'Select a stage and at least one player before submitting the lineup.',
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await tournamentApi.submitStageLineup(tournament.id, effectiveStageId, {
        clubId,
        operatorId,
        seats: workbench.selectedPlayerIds.map((playerId) => ({ playerId })),
      });
      notifySuccess('Lineup submitted', 'The tournament lineup has been submitted.');
      onOpenChange(false);
    } catch (error) {
      notifyWarning(
        'Unable to submit lineup',
        error instanceof Error
          ? error.message
          : 'The lineup submission did not complete.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface className="max-w-[min(920px,92vw)]">
          <ClubTournamentLineupHeader tournament={tournament} />
          <ClubTournamentLineupBody
            isLoading={workbench.isLoading}
            selectedStageId={workbench.selectedStageId}
            stageOptions={workbench.stageOptions}
            statusFilter={workbench.statusFilter}
            eloSort={workbench.eloSort}
            selectedPlayerIds={workbench.selectedPlayerIds}
            visibleMembers={workbench.visibleMembers}
            onSelectedStageIdChange={setSelectedStageId}
            onStatusFilterChange={setStatusFilter}
            onEloSortChange={setEloSort}
            onTogglePlayer={togglePlayer}
          />
          <ClubTournamentLineupFooter
            isSubmitting={workbench.isSubmitting}
            selectedPlayerIds={workbench.selectedPlayerIds}
            onSubmit={() => void handleSubmit()}
            onClose={() => onOpenChange(false)}
          />
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
