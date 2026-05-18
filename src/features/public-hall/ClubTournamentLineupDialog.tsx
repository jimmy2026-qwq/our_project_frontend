import { tournamentApi } from '@/api/tournament';
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
    operatorId,
    tournament,
    open,
  });

  async function handleSubmit() {
    const effectiveStageId = workbench.selectedStageId || workbench.stageOptions[0]?.stageId || '';

    if (!tournament?.id || !effectiveStageId || workbench.selectedPlayerIds.length === 0) {
      notifyWorkbenchWarning(
        '参赛名单不完整',
        '请先选择一个阶段，并至少勾选一名成员后再提交名单。',
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await tournamentApi.submitStageLineup(tournament.id, effectiveStageId, {
        clubId,
        operatorId,
        playerIds: workbench.selectedPlayerIds,
      });
      notifySuccess(
        '名单提交成功',
        '已将所选成员提交到当前赛事阶段。',
      );
      onOpenChange(false);
    } catch (error) {
      notifyWarning(
        '无法提交参赛名单',
        error instanceof Error
          ? error.message
          : '参赛名单提交失败，请确认当前赛事状态后重试。',
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
