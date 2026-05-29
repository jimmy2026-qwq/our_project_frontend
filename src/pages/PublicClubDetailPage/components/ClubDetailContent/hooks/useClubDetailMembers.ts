import { useMemo } from 'react';

import type { AuthSession } from '@/providers/auth/AuthSession';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

import {
  applyContributionTitleOverrides,
  buildContributionTitleFields,
} from '../functions/buildClubDetailContributionTitles';
import type { ClubPublicProfile } from '../../../objects/PublicClubDetailPage.types';
import { useClubAdminMemberEntries } from './useClubAdminMemberEntries';
import { useClubMemberNames } from './useClubMemberNames';
import { useClubRankTree } from './useClubRankTree';

interface UseClubDetailMembersParams {
  profile: ClubPublicProfile | null;
  session: AuthSession | null;
  currentPlayerProfile: PlayerProfile | null;
}

export function useClubDetailMembers({
  profile,
  session,
  currentPlayerProfile,
}: UseClubDetailMembersParams) {
  const { clubRankTree, setContributionTitleRefreshKey } =
    useClubRankTree(profile);
  const { clubMemberNames } = useClubMemberNames(profile);
  const { clubMembers, isClubMembersLoading, refreshClubMembers } =
    useClubAdminMemberEntries({
      profile,
      session,
      currentPlayerProfile,
    });
  const contributionTitleFields = useMemo(
    () =>
      profile ? buildContributionTitleFields(clubMembers, clubRankTree) : [],
    [clubMembers, clubRankTree, profile],
  );
  const displayClubMembers = useMemo(
    () => applyContributionTitleOverrides(clubMembers, contributionTitleFields),
    [clubMembers, contributionTitleFields],
  );

  return {
    clubMemberNames,
    clubMembers: displayClubMembers,
    contributionTitleFields,
    setContributionTitleRefreshKey,
    isClubMembersLoading,
    refreshClubMembers,
  };
}
