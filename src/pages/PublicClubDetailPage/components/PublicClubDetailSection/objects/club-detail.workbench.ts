import type { AuthSession } from '@/providers/auth/AuthSession';
import type { ClubPublicProfile } from '../../../objects/types';

import type { ClubDetailWorkbenchState } from '../../../objects/club-detail.types';
import type { ClubDetailData } from '../hooks/ClubDetailData.hooks';

interface BuildClubDetailWorkbenchParams {
  profile: ClubPublicProfile | null;
  session: AuthSession | null;
  data: ClubDetailData;
}

export function buildClubDetailWorkbench({
  profile,
  session,
  data,
}: BuildClubDetailWorkbenchParams): ClubDetailWorkbenchState | null {
  if (!profile) {
    return null;
  }

  const isClubMember = data.isCurrentMember || data.isFeaturedMember;
  const featuredPlayerNames = Array.from(
    new Map(
      [...profile.featuredPlayers, ...data.clubMemberNames].map((name) => [
        name.trim().toLowerCase(),
        name,
      ]),
    ).values(),
  );
  const canApply = !!session?.user.roles.isRegisteredPlayer && !isClubMember;
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const actionableTournaments = profile.activeTournaments.filter(
    (item) => item.canSubmitLineup,
  );
  const canManageLineup =
    !!session?.user.roles.isRegisteredPlayer &&
    actionableTournaments.length > 0;

  return {
    profile,
    operatorId,
    isApplicationDialogOpen: data.isApplicationDialogOpen,
    isLineupDialogOpen: data.isLineupDialogOpen,
    selectedLineupTournament: data.selectedLineupTournament,
    isContributionDialogOpen: data.isContributionDialogOpen,
    selectedContributionMember: data.selectedContributionMember,
    isContributionSubmitting: data.isContributionSubmitting,
    isTitleDialogOpen: data.isTitleDialogOpen,
    selectedTitleMember: data.selectedTitleMember,
    isTitleSubmitting: data.isTitleSubmitting,
    isContributionTitleDialogOpen: data.isContributionTitleDialogOpen,
    isContributionTitleSubmitting: data.isContributionTitleSubmitting,
    contributionTitleFields: data.contributionTitleFields,
    isCurrentMember: data.isCurrentMember,
    isCurrentClubAdmin: data.isCurrentClubAdmin,
    clubMemberNames: data.clubMemberNames,
    currentApplicationStatus: data.currentApplicationStatus,
    applicationInbox: data.applicationInbox,
    isInboxLoading: data.isInboxLoading,
    contributionChanges: data.contributionChanges,
    isContributionChangesLoading: data.isContributionChangesLoading,
    canViewContributionChanges: data.canViewContributionChanges,
    canReviewApplications: data.canReviewApplications,
    canAssignAdmins: data.canAssignAdmins,
    canAdjustContributions: data.canAdjustContributions,
    canEditTitles: data.canEditTitles,
    canRemoveMembers: data.canRemoveMembers,
    clubMembers: data.clubMembers,
    isClubMembersLoading: data.isClubMembersLoading,
    isFeaturedMember: data.isFeaturedMember,
    isClubMember,
    featuredPlayerNames,
    canApply,
    actionableTournaments,
    canManageLineup,
  };
}
