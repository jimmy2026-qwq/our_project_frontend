import { describe, expect, it } from 'vitest';

import { buildClubDetailWorkbench } from '@/pages/PublicClubDetailPage/components/ClubDetailContent/functions/buildClubDetailWorkbench';
import type { ClubDetailData } from '@/pages/PublicClubDetailPage/components/ClubDetailContent/hooks/useClubDetailData';
import type { ClubPublicProfile } from '@/pages/PublicClubDetailPage/objects/PublicClubDetailPage.types';
import type { AuthSession } from '@/providers/auth/AuthSession';

describe('buildClubDetailWorkbench relation permissions', () => {
  it('returns null until club profile data is available', () => {
    expect(
      buildClubDetailWorkbench({
        profile: null,
        session: null,
        data: data({ isCurrentClubAdmin: false }),
      }),
    ).toBeNull();
  });

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

  it('deduplicates featured player names and enables applications only for non-members', () => {
    const workbench = buildClubDetailWorkbench({
      profile: profile({
        featuredPlayers: ['Larry', 'Alice'],
      }),
      session: session({ isSuperAdmin: false, isClubAdmin: false }),
      data: data({
        clubMemberNames: [' larry ', 'Bob'],
        isCurrentClubAdmin: false,
        isCurrentMember: false,
      }),
    });

    expect(workbench?.featuredPlayerNames).toEqual(['Larry', 'Alice', 'Bob']);
    expect(workbench?.isClubMember).toBe(false);
    expect(workbench?.canApply).toBe(true);
  });

  it('blocks applications for featured members and guest sessions', () => {
    const featuredMemberWorkbench = buildClubDetailWorkbench({
      profile: profile(),
      session: session({ isSuperAdmin: false, isClubAdmin: false }),
      data: data({
        isCurrentClubAdmin: false,
        isCurrentMember: false,
        isFeaturedMember: true,
      }),
    });
    const guestWorkbench = buildClubDetailWorkbench({
      profile: profile(),
      session: session({
        isRegisteredPlayer: false,
        isSuperAdmin: false,
        isClubAdmin: false,
      }),
      data: data({
        isCurrentClubAdmin: false,
        isCurrentMember: false,
      }),
    });

    expect(featuredMemberWorkbench?.isClubMember).toBe(true);
    expect(featuredMemberWorkbench?.canApply).toBe(false);
    expect(guestWorkbench?.canApply).toBe(false);
  });

  it('derives lineup actions and operator id fallback from session and tournaments', () => {
    const workbench = buildClubDetailWorkbench({
      profile: profile({
        activeTournaments: [
          {
            canSubmitLineup: false,
            id: 'tournament-idle',
            name: 'Idle Tournament',
          },
          {
            canSubmitLineup: true,
            id: 'tournament-actionable',
            name: 'Actionable Tournament',
          },
        ],
      }),
      session: session({
        isSuperAdmin: false,
        isClubAdmin: false,
        operatorId: null,
      }),
      data: data({ isCurrentClubAdmin: false }),
    });

    expect(workbench?.operatorId).toBe('user-a');
    expect(workbench?.actionableTournaments).toEqual([
      expect.objectContaining({ id: 'tournament-actionable' }),
    ]);
    expect(workbench?.canManageLineup).toBe(true);
  });
});

function profile(
  overrides: Partial<ClubPublicProfile> = {},
): ClubPublicProfile {
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
    ...overrides,
  };
}

function session({
  isClubAdmin,
  isRegisteredPlayer = true,
  operatorId = 'player-a',
  isSuperAdmin,
}: {
  isClubAdmin: boolean;
  isRegisteredPlayer?: boolean;
  operatorId?: string | null;
  isSuperAdmin: boolean;
}): AuthSession {
  return {
    token: 'token',
    user: {
      userId: 'user-a',
      username: 'tester',
      displayName: 'Tester',
      operatorId: operatorId as string,
      roles: {
        isGuest: !isRegisteredPlayer,
        isRegisteredPlayer,
        isClubAdmin,
        isTournamentAdmin: false,
        isSuperAdmin,
      },
    },
  };
}

function data({
  clubMemberNames = [],
  isCurrentClubAdmin,
  isCurrentMember = true,
  isFeaturedMember = false,
}: {
  clubMemberNames?: string[];
  isCurrentClubAdmin: boolean;
  isCurrentMember?: boolean;
  isFeaturedMember?: boolean;
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
    isCurrentMember,
    isCurrentClubAdmin,
    isFeaturedMember,
    clubMemberNames,
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
