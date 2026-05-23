import { useEffect, useState } from 'react';

import {
  authApi,
  clubsApi,
  opsAnalyticsApi,
} from '@/pages/PublicShared/objects/data.transport';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type { ClubApplication, ClubApplicationView } from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';
import type { ClubPublicProfile } from '@/pages/PublicShared/objects';
import type { Permission } from '@/objects/auth';
import {
  loadPlayerContext,
  loadTrackedApplication,
} from '@/pages/PublicShared/objects/application-data';

import type {
  ClubAdminMemberEntry,
  ClubDetailWorkbenchState,
} from '../objects/club-detail.types';
import {
  loadClubMemberAdminEntries,
  resolveClubAdminAccess,
} from '../objects/club-detail.workbench';

interface UseClubDetailDataParams {
  profile: ClubPublicProfile | null;
  session: AuthSession | null;
}

export function useClubDetailData({
  profile,
  session,
}: UseClubDetailDataParams) {
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isLineupDialogOpen, setIsLineupDialogOpen] = useState(false);
  const [selectedLineupTournament, setSelectedLineupTournament] = useState<
    ClubPublicProfile['activeTournaments'][number] | null
  >(null);
  const [isContributionDialogOpen, setIsContributionDialogOpen] =
    useState(false);
  const [selectedContributionMember, setSelectedContributionMember] =
    useState<ClubAdminMemberEntry | null>(null);
  const [isContributionSubmitting, setIsContributionSubmitting] =
    useState(false);
  const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
  const [selectedTitleMember, setSelectedTitleMember] =
    useState<ClubAdminMemberEntry | null>(null);
  const [isTitleSubmitting, setIsTitleSubmitting] = useState(false);
  const [isCurrentMember, setIsCurrentMember] = useState(false);
  const [isCurrentClubAdmin, setIsCurrentClubAdmin] = useState(false);
  const [clubMemberNames, setClubMemberNames] = useState<string[]>([]);
  const [currentPlayerProfile, setCurrentPlayerProfile] =
    useState<PlayerProfile | null>(null);
  const [currentApplicationStatus, setCurrentApplicationStatus] = useState<
    ClubApplication['status'] | null
  >(null);
  const [applicationInbox, setApplicationInbox] = useState<
    ClubApplicationView[]
  >([]);
  const [isInboxLoading, setIsInboxLoading] = useState(false);
  const [contributionChanges, setContributionChanges] = useState<
    ClubDetailWorkbenchState['contributionChanges']
  >([]);
  const [isContributionChangesLoading, setIsContributionChangesLoading] =
    useState(false);
  const [contributionChangesRefreshKey, setContributionChangesRefreshKey] =
    useState(0);
  const [canViewContributionChanges, setCanViewContributionChanges] =
    useState(false);
  const [baseClubPermissions, setBaseClubPermissions] = useState({
    canAssignAdmins: false,
    canAdjustContributions: false,
    canEditTitles: false,
    canManageMembership: false,
  });
  const [clubMembers, setClubMembers] = useState<ClubAdminMemberEntry[]>([]);
  const [isClubMembersLoading, setIsClubMembersLoading] = useState(false);

  const isFeaturedMember =
    !!session?.user.roles.isRegisteredPlayer &&
    !!profile &&
    profile.featuredPlayers.some(
      (name) =>
        name.trim().toLowerCase() ===
        session.user.displayName.trim().toLowerCase(),
    );
  const currentMemberEntry = clubMembers.find((member) => member.isCurrentUser);
  const currentMemberPrivileges = currentMemberEntry?.privileges ?? [];
  const hasApproveRosterPrivilege =
    currentMemberPrivileges.includes('approve-roster');
  const canReviewApplications =
    baseClubPermissions.canManageMembership || hasApproveRosterPrivilege;
  const canRemoveMembers = canReviewApplications;
  const canAssignAdmins = baseClubPermissions.canAssignAdmins;
  const canAdjustContributions =
    baseClubPermissions.canAdjustContributions;
  const canEditTitles = baseClubPermissions.canEditTitles;
  useEffect(() => {
    if (!session?.user.roles.isRegisteredPlayer || !profile) {
      setIsCurrentMember(false);
      setIsCurrentClubAdmin(false);
      setCurrentApplicationStatus(null);
      return;
    }

    let cancelled = false;
    const operatorId = session.user.operatorId ?? session.user.userId;
    const clubId = profile.id;

    const refreshMembershipStatus = () => {
      void (async () => {
        const playerContext = await loadPlayerContext(
          operatorId,
          session.user.displayName,
        );

        if (cancelled) {
          return;
        }

        const adminLookupPlayerId =
          playerContext.player?.playerId ?? operatorId;
        const isAdmin = await resolveClubAdminAccess(
          clubId,
          adminLookupPlayerId,
        );

        if (cancelled) {
          return;
        }

        const isMember =
          playerContext.player?.clubIds?.includes(clubId) ?? false;
        setCurrentPlayerProfile(playerContext.player);
        setIsCurrentMember(isMember);
        setIsCurrentClubAdmin(isAdmin);

        if (isMember) {
          setCurrentApplicationStatus(null);
          return;
        }

        const application = await loadTrackedApplication(operatorId, clubId);

        if (!cancelled) {
          setCurrentApplicationStatus(application.application?.status ?? null);
        }
      })().catch(() => {
        if (!cancelled) {
          setCurrentPlayerProfile(null);
          setIsCurrentClubAdmin(false);
          setCurrentApplicationStatus(null);
        }
      });
    };

    refreshMembershipStatus();
    window.addEventListener('focus', refreshMembershipStatus);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', refreshMembershipStatus);
    };
  }, [isApplicationDialogOpen, profile, session]);

  useEffect(() => {
    if (!profile) {
      setClubMemberNames([]);
      return;
    }

    let cancelled = false;

    void clubsApi
      .getClubMembers(profile.id, { limit: 100, offset: 0 })
      .then((envelope) => {
        if (!cancelled) {
          setClubMemberNames(
            envelope.items
              .map((item) => item.displayName)
              .filter((name) => name.trim().length > 0),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setClubMemberNames([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [profile]);

  useEffect(() => {
    if (!profile) {
      setClubMembers([]);
      setIsClubMembersLoading(false);
      return;
    }

    let cancelled = false;
    const currentOperatorId =
      session?.user.operatorId ?? session?.user.userId ?? '';
    setIsClubMembersLoading(true);

    void loadClubMemberAdminEntries(
      profile.id,
      currentOperatorId,
      currentPlayerProfile,
    )
      .then((entries) => {
        if (!cancelled) {
          setClubMembers(entries);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setClubMembers([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsClubMembersLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentPlayerProfile, profile, session]);

  useEffect(() => {
    if (!profile || !session) {
      setBaseClubPermissions({
        canAssignAdmins: false,
        canAdjustContributions: false,
        canEditTitles: false,
        canManageMembership: false,
      });
      return;
    }

    const operatorId = session.user.operatorId ?? session.user.userId;

    if (!operatorId) {
      setBaseClubPermissions({
        canAssignAdmins: false,
        canAdjustContributions: false,
        canEditTitles: false,
        canManageMembership: false,
      });
      return;
    }

    let cancelled = false;
    setBaseClubPermissions({
      canAssignAdmins: false,
      canAdjustContributions: false,
      canEditTitles: false,
      canManageMembership: false,
    });
    const check = (permission: Permission) =>
      authApi
        .checkPermission({
          operatorId,
          permission,
          clubId: profile.id,
        })
        .catch(() => false);

    void Promise.all([
      check('AssignClubAdmin'),
      check('ManageClubOperations'),
      check('SetClubTitle'),
      check('ManageClubMembership'),
    ]).then(
      ([
        canAssignAdmins,
        canAdjustContributions,
        canEditTitles,
        canManageMembership,
      ]) => {
        if (!cancelled) {
          setBaseClubPermissions({
            canAssignAdmins,
            canAdjustContributions,
            canEditTitles,
            canManageMembership,
          });
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [profile, session]);

  useEffect(() => {
    if (
      !session?.user.roles.isRegisteredPlayer ||
      !profile ||
      !canReviewApplications
    ) {
      setApplicationInbox([]);
      setIsInboxLoading(false);
      return;
    }

    let cancelled = false;
    const operatorId = session.user.operatorId ?? session.user.userId;
    setIsInboxLoading(true);

    void clubsApi
      .getClubApplications(profile.id, {
        operatorId,
        status: 'Pending',
        limit: 20,
        offset: 0,
      })
      .then((envelope) => {
        if (!cancelled) {
          setApplicationInbox(envelope.items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApplicationInbox([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsInboxLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [canReviewApplications, profile, session]);

  useEffect(() => {
    if (!profile || !session) {
      setCanViewContributionChanges(false);
      return;
    }

    const operatorId = session.user.operatorId ?? session.user.userId;

    if (!operatorId) {
      setCanViewContributionChanges(false);
      return;
    }

    let cancelled = false;
    setCanViewContributionChanges(false);

    void authApi
      .checkPermission({
        operatorId,
        permission: 'ViewAuditTrail',
        clubId: profile.id,
      })
      .then((canView) => {
        if (!cancelled) {
          setCanViewContributionChanges(canView);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCanViewContributionChanges(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [profile, session]);

  useEffect(() => {
    if (!profile || !canViewContributionChanges) {
      setContributionChanges([]);
      setIsContributionChangesLoading(false);
      return;
    }

    const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';

    if (!operatorId) {
      setContributionChanges([]);
      setIsContributionChangesLoading(false);
      return;
    }

    let cancelled = false;
    setIsContributionChangesLoading(true);

    void opsAnalyticsApi
      .getClubContributionAudits({
        clubId: profile.id,
        operatorId,
        limit: 100,
        offset: 0,
      })
      .then((envelope) => {
        if (!cancelled) {
          setContributionChanges(envelope.items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContributionChanges([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsContributionChangesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [canViewContributionChanges, contributionChangesRefreshKey, profile, session]);

  return {
    isApplicationDialogOpen,
    setIsApplicationDialogOpen,
    isLineupDialogOpen,
    setIsLineupDialogOpen,
    selectedLineupTournament,
    setSelectedLineupTournament,
    isContributionDialogOpen,
    setIsContributionDialogOpen,
    selectedContributionMember,
    setSelectedContributionMember,
    isContributionSubmitting,
    setIsContributionSubmitting,
    isTitleDialogOpen,
    setIsTitleDialogOpen,
    selectedTitleMember,
    setSelectedTitleMember,
    isTitleSubmitting,
    setIsTitleSubmitting,
    isCurrentMember,
    setIsCurrentMember,
    isCurrentClubAdmin,
    clubMemberNames,
    currentPlayerProfile,
    currentApplicationStatus,
    setCurrentApplicationStatus,
    applicationInbox,
    setApplicationInbox,
    isInboxLoading,
    contributionChanges,
    isContributionChangesLoading,
    setContributionChangesRefreshKey,
    canViewContributionChanges,
    canReviewApplications,
    canRemoveMembers,
    canAssignAdmins,
    canAdjustContributions,
    canEditTitles,
    clubMembers,
    setClubMembers,
    isClubMembersLoading,
    setIsClubMembersLoading,
    isFeaturedMember,
  };
}

export type ClubDetailData = ReturnType<typeof useClubDetailData>;
