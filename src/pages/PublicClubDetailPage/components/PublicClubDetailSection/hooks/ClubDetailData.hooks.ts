import type { AuthSession } from '@/providers/auth/AuthSession';

import type { ClubPublicProfile } from '../../../objects/types';
import { useClubApplicationInbox } from './ClubApplicationInbox.hooks';
import { useClubContributionChanges } from './ClubContributionChanges.hooks';
import { useClubDetailDialogs } from './ClubDetailDialogs.hooks';
import { useClubDetailMembership } from './ClubDetailMembership.hooks';
import { useClubDetailMembers } from './ClubDetailMembers.hooks';
import { useClubDetailPermissions } from './ClubDetailPermissions.hooks';

interface UseClubDetailDataParams {
  profile: ClubPublicProfile | null;
  session: AuthSession | null;
}

export function useClubDetailData({
  profile,
  session,
}: UseClubDetailDataParams) {
  const dialogs = useClubDetailDialogs();
  const membership = useClubDetailMembership({
    profile,
    session,
    isApplicationDialogOpen: dialogs.isApplicationDialogOpen,
  });
  const members = useClubDetailMembers({
    profile,
    session,
    currentPlayerProfile: membership.currentPlayerProfile,
  });
  const currentMemberEntry = members.clubMembers.find(
    (member) => member.isCurrentUser,
  );
  const permissions = useClubDetailPermissions({
    profile,
    session,
    currentMemberPrivileges: currentMemberEntry?.privileges ?? [],
  });
  const inbox = useClubApplicationInbox({
    profile,
    session,
    canReviewApplications: permissions.canReviewApplications,
  });
  const contributionChanges = useClubContributionChanges({
    profile,
    session,
    canViewContributionChanges: permissions.canViewContributionChanges,
  });

  return {
    ...dialogs,
    ...membership,
    ...members,
    ...permissions,
    ...inbox,
    ...contributionChanges,
  };
}

export type ClubDetailData = ReturnType<typeof useClubDetailData>;
