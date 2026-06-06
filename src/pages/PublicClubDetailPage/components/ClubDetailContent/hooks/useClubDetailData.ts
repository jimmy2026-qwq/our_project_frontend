import type { AuthSession } from '@/providers/auth/AuthSession';

import type { ClubPublicProfile } from '../../../objects/PublicClubDetailPage.types';
import { useClubApplicationInbox } from './useClubApplicationInbox';
import { useClubContributionChanges } from './useClubContributionChanges';
import { useClubDetailDialogs } from './useClubDetailDialogs';
import { useClubDetailMembership } from './useClubDetailMembership';
import { useClubDetailMembers } from './useClubDetailMembers';
import { useClubDetailPermissions } from './useClubDetailPermissions';

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
