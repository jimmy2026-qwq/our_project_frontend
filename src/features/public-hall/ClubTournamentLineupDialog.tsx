import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
} from '@/components/ui';
import { useNotice } from '@/hooks';
import { operationsApi } from '@/api/operations';

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
        'ç’‡å³°åŽ›é–«å¤‹å«¨é™å‚ç¦ŒéŽ´æ„¬æ†³',
        'é‘·å†²çš¯é—‡â‚¬ç‘•ä¾€â‚¬å¤‹å«¨æ¶“â‚¬éšå¶„å‹˜æ¶”æ„°å„´éŽ´æ„¬æ†³éŽ»æ„ªæ°¦é’æ¿ç¶‹é“å¶ˆç¦Œæµœå¬®æ¨å¨ˆç‚¹â‚¬?',
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
        'é™å‚ç¦Œéšå¶…å´Ÿå®¸å‰å½æµœ?',
        'æ·‡å˜ç®°é–®ã„¥å¼¬ç’§æ¶˜æ‚•é—æ›žå‡¡ç¼å¿“æ‚“å§ãƒ¥åŸŒè¤°æ’³å¢ ç’§æ¶—ç°¨é—ƒèˆµî†ŒéŠ†?',
      );
      onOpenChange(false);
    } catch (error) {
      notifyWarning(
        'éŽ»æ„ªæ°¦é™å‚ç¦Œéšå¶…å´Ÿæ¾¶è¾«è§¦',
        error instanceof Error ? error.message : 'éƒçŠ³ç¡¶éŽ»æ„ªæ°¦è¤°æ’³å¢ é™å‚ç¦Œéšå¶…å´ŸéŠ†?',
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
