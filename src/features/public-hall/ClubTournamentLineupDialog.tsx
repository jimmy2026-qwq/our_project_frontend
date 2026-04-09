import { operationsApi } from '@/api/operations';
import { useNotice } from '@/hooks';
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
} from '@/components/ui';

import { useClubTournamentLineupWorkbench } from './ClubTournamentLineupDialog.hooks';
import {
  ClubTournamentLineupBody,
  ClubTournamentLineupFooter,
  ClubTournamentLineupHeader,
} from './ClubTournamentLineupDialog.panels';
import type { ClubTournamentItem } from './ClubTournamentLineupDialog.types';

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
    tournament,
    open,
  });

  async function handleSubmit() {
    if (!tournament?.id || !workbench.selectedStageId || workbench.selectedPlayerIds.length === 0) {
      notifyWorkbenchWarning(
        'Lineup is incomplete',
        'Select a stage and at least one player before submitting the club lineup.',
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await operationsApi.submitStageLineup(tournament.id, workbench.selectedStageId, {
        clubId,
        operatorId,
        playerIds: workbench.selectedPlayerIds,
      });
      notifySuccess(
        'Lineup submitted',
        'The selected players were submitted for the current tournament stage.',
      );
      onOpenChange(false);
    } catch (error) {
      notifyWarning(
        'Unable to submit lineup',
        error instanceof Error
          ? error.message
          : 'The lineup request failed. Please retry after checking the current tournament state.',
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
