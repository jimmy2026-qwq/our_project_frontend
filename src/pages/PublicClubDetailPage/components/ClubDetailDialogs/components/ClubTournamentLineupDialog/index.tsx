import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
} from '@/components/ui';

import { useClubTournamentLineupWorkbench } from './hooks/useClubTournamentLineupDialog';
import {
  ClubTournamentLineupBody,
  ClubTournamentLineupFooter,
  ClubTournamentLineupHeader,
} from './ClubTournamentLineupDialog.panels';
import type { ClubTournamentItem } from './types';

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
  const {
    workbench,
    setSelectedStageId,
    setStatusFilter,
    setEloSort,
    togglePlayer,
    submitLineup,
  } = useClubTournamentLineupWorkbench({
    clubId,
    operatorId,
    tournament,
    open,
  });

  async function handleSubmit() {
    const submitted = await submitLineup();
    if (submitted) {
      onOpenChange(false);
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
