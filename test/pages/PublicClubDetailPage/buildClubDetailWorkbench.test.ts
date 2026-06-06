import { describe, expect, it } from 'vitest';

import { buildClubDetailWorkbench } from '@/pages/PublicClubDetailPage/components/ClubDetailContent/functions/buildClubDetailWorkbench';
import type { ClubDetailData } from '@/pages/PublicClubDetailPage/components/ClubDetailContent/hooks/useClubDetailData';
import type { ClubPublicProfile } from '@/pages/PublicClubDetailPage/objects/PublicClubDetailPage.types';
import type { AuthSession } from '@/providers/auth/AuthSession';

describe('buildClubDetailWorkbench relation permissions', () => {
  it('allows super admins to manage club relations directly', () => {
    const workbench = buildClubDetailWorkbench({
      profile: profile(),
      session: session({ isSuperAdmin: true, isClubAdmin: false }),
      data: data({ isCurrentClubAdmin: false }),
    });

    expect(workbench?.canManageRelations).toBe(true);
    expect(workbench?.canRequestRelationChange).toBe(false);
  });

  it('allows ordinary club admins to request relation changes only', () => {
    const workbench = buildClubDetailWorkbench({
      profile: profile(),
      session: session({ isSuperAdmin: false, isClubAdmin: true }),
      data: data({ isCurrentClubAdmin: true }),
    });

    expect(workbench?.canManageRelations).toBe(false);
    expect(workbench?.canRequestRelationChange).toBe(true);
  });

  it('hides relation actions from non-admin members', () => {
    const workbench = buildClubDetailWorkbench({
      profile: profile(),
      session: session({ isSuperAdmin: false, isClubAdmin: false }),
      data: data({ isCurrentClubAdmin: false }),
    });

    expect(workbench?.canManageRelations).toBe(false);
    expect(workbench?.canRequestRelationChange).toBe(false);
  });
});

function profile(): ClubPublicProfile {
  return {
    id: 'club-a',
    name: 'Club A',
    slogan: '',
    description: '',
    memberCount: 4,
    powerRating: 1500,
    treasury: 0,
    relations: [],
    featuredPlayers: [],
    activeTournaments: [],
  };
}

function session({
  isClubAdmin,
  isSuperAdmin,
}: {
  isClubAdmin: boolean;
  isSuperAdmin: boolean;
}): AuthSession {
  return {
    token: 'token',
    user: {
      userId: 'user-a',
      username: 'tester',
      displayName: 'Tester',
      operatorId: 'player-a',
      roles: {
        isGuest: false,
        isRegisteredPlayer: true,
        isClubAdmin,
        isTournamentAdmin: false,
        isSuperAdmin,
      },
    },
  };
}

function data({
  isCurrentClubAdmin,
}: {
  isCurrentClubAdmin: boolean;
}): ClubDetailData {
  return {
    isApplicationDialogOpen: false,
    isLineupDialogOpen: false,
    selectedLineupTournament: null,
    isContributionDialogOpen: false,
    selectedContributionMember: null,
    isContributionSubmitting: false,
    isTitleDialogOpen: false,
    selectedTitleMember: null,
    isTitleSubmitting: false,
    isContributionTitleDialogOpen: false,
    isContributionTitleSubmitting: false,
    isRelationDialogOpen: false,
    isRelationSubmitting: false,
    contributionTitleFields: [],
    isCurrentMember: true,
    isCurrentClubAdmin,
    isFeaturedMember: false,
    clubMemberNames: [],
    currentApplicationStatus: null,
    applicationInbox: [],
    isInboxLoading: false,
    contributionChanges: [],
    isContributionChangesLoading: false,
    canViewContributionChanges: false,
    canReviewApplications: isCurrentClubAdmin,
    canAssignAdmins: false,
    canAdjustContributions: false,
    canEditTitles: isCurrentClubAdmin,
    canManageMembership: isCurrentClubAdmin,
    canRemoveMembers: isCurrentClubAdmin,
    clubMembers: [],
    isClubMembersLoading: false,
  } as unknown as ClubDetailData;
}
