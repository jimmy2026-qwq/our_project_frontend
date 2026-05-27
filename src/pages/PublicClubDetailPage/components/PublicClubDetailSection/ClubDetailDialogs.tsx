import { type Dispatch, type SetStateAction } from 'react';

import type {
  ClubAdminMemberEntry,
  ClubContributionTitleDraft,
  ClubDetailWorkbenchState,
} from '../../objects/club-detail.types';
import type { ClubApplication } from '@/pages/objects/club';

import { ClubApplicationDialog } from './components/ClubApplicationDialog';
import { ClubContributionDialog } from './components/ClubContributionDialog';
import { ClubContributionTitlesDialog } from './components/ClubContributionTitlesDialog';
import { ClubTitleDialog } from './components/ClubTitleDialog';
import { ClubTournamentLineupDialog } from './components/ClubTournamentLineupDialog';

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
  onRefreshDetail?: () => void;
  setIsApplicationDialogOpen: (isOpen: boolean) => void;
  setIsLineupDialogOpen: (isOpen: boolean) => void;
  setSelectedLineupTournament: Dispatch<
    SetStateAction<ClubDetailWorkbenchState['selectedLineupTournament']>
  >;
  setIsContributionDialogOpen: (isOpen: boolean) => void;
  setSelectedContributionMember: Dispatch<
    SetStateAction<ClubAdminMemberEntry | null>
  >;
  setIsTitleDialogOpen: (isOpen: boolean) => void;
  setSelectedTitleMember: Dispatch<SetStateAction<ClubAdminMemberEntry | null>>;
  setIsContributionTitleDialogOpen: (isOpen: boolean) => void;
  setIsCurrentMember: (isCurrentMember: boolean) => void;
  handleApplicationStatusChange: (
    status: ClubApplication['status'] | null,
  ) => void;
  handleAdjustContribution: (
    member: ClubAdminMemberEntry,
    delta: number,
    note?: string,
  ) => Promise<void>;
  handleUpdateTitle: (
    member: ClubAdminMemberEntry,
    nextTitle: string,
  ) => Promise<void>;
  handleUpdateContributionTitles: (
    drafts: ClubContributionTitleDraft[],
  ) => Promise<void>;
}

export function ClubDetailDialogs({
  workbench,
  clubSummary,
  onRefreshDetail,
  setIsApplicationDialogOpen,
  setIsLineupDialogOpen,
  setSelectedLineupTournament,
  setIsContributionDialogOpen,
  setSelectedContributionMember,
  setIsTitleDialogOpen,
  setSelectedTitleMember,
  setIsContributionTitleDialogOpen,
  setIsCurrentMember,
  handleApplicationStatusChange,
  handleAdjustContribution,
  handleUpdateTitle,
  handleUpdateContributionTitles,
}: ClubDetailDialogsProps) {
  return (
    <>
      {workbench.canApply ? (
        <ClubApplicationDialog
          club={clubSummary}
          open={workbench.isApplicationDialogOpen}
          onOpenChange={setIsApplicationDialogOpen}
          onApplicationUpdated={handleApplicationStatusChange}
          onMembershipConfirmed={() => {
            setIsCurrentMember(true);
            handleApplicationStatusChange(null);
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
            setIsLineupDialogOpen(nextOpen);
            if (!nextOpen) {
              setSelectedLineupTournament(null);
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
            setIsContributionDialogOpen(nextOpen);
            if (!nextOpen) {
              setSelectedContributionMember(null);
            }
          }}
          onSubmit={handleAdjustContribution}
        />
      ) : null}

      {workbench.canEditTitles ? (
        <ClubTitleDialog
          open={workbench.isTitleDialogOpen}
          member={workbench.selectedTitleMember}
          isSubmitting={workbench.isTitleSubmitting}
          onOpenChange={(nextOpen) => {
            setIsTitleDialogOpen(nextOpen);
            if (!nextOpen) {
              setSelectedTitleMember(null);
            }
          }}
          onSubmit={handleUpdateTitle}
        />
      ) : null}

      <ClubContributionTitlesDialog
        open={workbench.isContributionTitleDialogOpen}
        fields={workbench.contributionTitleFields}
        canManage={workbench.canEditTitles}
        isSubmitting={workbench.isContributionTitleSubmitting}
        onOpenChange={setIsContributionTitleDialogOpen}
        onSubmit={handleUpdateContributionTitles}
      />
    </>
  );
}
