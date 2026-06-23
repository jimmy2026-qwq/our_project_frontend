import type { ClubDetailWorkbenchState } from '@/pages/PublicClubDetailPage/objects/state/workbench/ClubDetailWorkbenchState';

import { ClubApplicationDialog } from './components/ClubApplicationDialog';
import { ClubContributionDialog } from './components/ClubContributionDialog';
import { ClubContributionTitlesDialog } from './components/ClubContributionTitlesDialog';
import { ClubRelationDialog, ClubRelationDialogModes } from './components/ClubRelationDialog';
import { ClubTitleDialog } from './components/ClubTitleDialog';
import { ClubTournamentLineupDialog } from './components/ClubTournamentLineupDialog';
import type { useClubDetailWorkbench } from '../ClubDetailContent/hooks/useClubDetailWorkbench';

type ClubDetailControls = Omit<
  ReturnType<typeof useClubDetailWorkbench>,
  'workbench'
>;

interface ClubDetailDialogsProps {
  workbench: ClubDetailWorkbenchState;
  clubSummary: {
    id: string;
    name: string;
    memberCount: number;
    powerRating: number;
    treasury: number;
    relations: ClubDetailWorkbenchState['profile']['relations'];
  };
  controls: ClubDetailControls;
  onRefreshDetail?: () => void;
}

/** 俱乐部详情页集中挂载的所有管理和申请弹窗。 */
export function ClubDetailDialogs({
  workbench,
  clubSummary,
  controls,
  onRefreshDetail,
}: ClubDetailDialogsProps) {
  return (
    <>
      {workbench.canApply ? (
        <ClubApplicationDialog
          club={clubSummary}
          open={workbench.isApplicationDialogOpen}
          onOpenChange={controls.setIsApplicationDialogOpen}
          onApplicationUpdated={controls.handleApplicationStatusChange}
          onMembershipConfirmed={() => {
            controls.setIsCurrentMember(true);
            controls.handleApplicationStatusChange(null);
            onRefreshDetail?.();
          }}
        />
      ) : null}

      {workbench.canManageLineup || !!workbench.selectedLineupTournament ? (
        <ClubTournamentLineupDialog
          clubId={workbench.profile.id}
          operatorId={workbench.operatorId}
          tournament={workbench.selectedLineupTournament}
          open={workbench.isLineupDialogOpen}
          onOpenChange={(nextOpen) => {
            controls.setIsLineupDialogOpen(nextOpen);
            if (!nextOpen) {
              controls.setSelectedLineupTournament(null);
            }
          }}
        />
      ) : null}

      {workbench.canAdjustContributions ? (
        <ClubContributionDialog
          open={workbench.isContributionDialogOpen}
          member={workbench.selectedContributionMember}
          isSubmitting={workbench.isContributionSubmitting}
          onOpenChange={(nextOpen) => {
            controls.setIsContributionDialogOpen(nextOpen);
            if (!nextOpen) {
              controls.setSelectedContributionMember(null);
            }
          }}
          onSubmit={controls.handleAdjustContribution}
        />
      ) : null}

      {workbench.canEditTitles ? (
        <ClubTitleDialog
          open={workbench.isTitleDialogOpen}
          member={workbench.selectedTitleMember}
          isSubmitting={workbench.isTitleSubmitting}
          onOpenChange={(nextOpen) => {
            controls.setIsTitleDialogOpen(nextOpen);
            if (!nextOpen) {
              controls.setSelectedTitleMember(null);
            }
          }}
          onSubmit={controls.handleUpdateTitle}
        />
      ) : null}

      <ClubContributionTitlesDialog
        open={workbench.isContributionTitleDialogOpen}
        fields={workbench.contributionTitleFields}
        canManage={workbench.canEditTitles}
        isSubmitting={workbench.isContributionTitleSubmitting}
        onOpenChange={controls.setIsContributionTitleDialogOpen}
        onSubmit={controls.handleUpdateContributionTitles}
      />

      {workbench.canManageRelations || workbench.canRequestRelationChange ? (
        <ClubRelationDialog
          clubId={workbench.profile.id}
          mode={
            workbench.canManageRelations
              ? ClubRelationDialogModes.Manage
              : ClubRelationDialogModes.Request
          }
          open={workbench.isRelationDialogOpen}
          isSubmitting={workbench.isRelationSubmitting}
          onOpenChange={controls.setIsRelationDialogOpen}
          onSubmit={controls.handleUpdateRelation}
        />
      ) : null}
    </>
  );
}
