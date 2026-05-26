import { useEffect, useMemo, useState } from 'react';

import {
  authApi,
  clubsApi,
} from '@/pages/PublicShared/objects/data.transport';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type { ClubApplication, ClubApplicationView } from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';
import type { ClubPublicProfile } from '@/pages/PublicShared/objects';
import type { Permission } from '@/objects/auth';
import type { ClubRankNodeView } from '@/objects/club';
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

const DEFAULT_CONTRIBUTION_TITLE_FIELDS = [
  { rankCode: 'rookie', defaultLabel: '萌新', minimumContribution: 0 },
  { rankCode: 'member', defaultLabel: '同伴', minimumContribution: 500 },
  { rankCode: 'core', defaultLabel: '主力', minimumContribution: 1500 },
  { rankCode: 'ace', defaultLabel: '王牌', minimumContribution: 3000 },
] satisfies Array<{
  rankCode: string;
  defaultLabel: string;
  minimumContribution: number;
}>;

const LEGACY_MEMBER_TITLE = '成员';

function normalizeTitle(value: string | null | undefined) {
  return value?.trim() ?? '';
}

function isLegacyMemberTitle(value: string | null | undefined) {
  return normalizeTitle(value) === LEGACY_MEMBER_TITLE;
}

function defaultRankCodeForContribution(contribution: number | undefined) {
  if (typeof contribution !== 'number') {
    return null;
  }

  const matchingFields = DEFAULT_CONTRIBUTION_TITLE_FIELDS.filter(
    (field) => field.minimumContribution <= contribution,
  );
  const lastMatch = matchingFields[matchingFields.length - 1];

  return lastMatch?.rankCode ?? null;
}

function buildContributionTitleFields(
  members: ClubAdminMemberEntry[],
  rankTree: ClubRankNodeView[],
): ClubDetailWorkbenchState['contributionTitleFields'] {
  const defaultsByCode = new Map(
    DEFAULT_CONTRIBUTION_TITLE_FIELDS.map((field, index) => [
      field.rankCode,
      { ...field, sortIndex: index },
    ]),
  );
  const observedLabelsByCode = new Map(
    members
      .flatMap((member) => {
        const label = normalizeTitle(member.rankLabel);

        if (!member.rankCode || !label || isLegacyMemberTitle(label)) {
          return [];
        }

        return [[member.rankCode, label] as const];
      }),
  );
  const rankTreeByCode = new Map(
    rankTree
      .filter((field) => field.code.trim())
      .map((field) => [field.code, field]),
  );
  const rankCodes = Array.from(
    new Set([
      ...DEFAULT_CONTRIBUTION_TITLE_FIELDS.map((field) => field.rankCode),
      ...rankTreeByCode.keys(),
      ...observedLabelsByCode.keys(),
    ]),
  );

  return rankCodes
    .map((rankCode) => {
      const defaultField = defaultsByCode.get(rankCode);
      const rankTreeField = rankTreeByCode.get(rankCode);
      const defaultLabel =
        defaultField?.defaultLabel ??
        observedLabelsByCode.get(rankCode) ??
        rankCode;
      const displayLabel =
        rankTreeField?.label?.trim() ||
        observedLabelsByCode.get(rankCode) ||
        defaultLabel;

      return {
        rankCode,
        defaultLabel,
        displayLabel,
        minimumContribution:
          rankTreeField?.minimumContribution ??
          defaultField?.minimumContribution,
        privileges: rankTreeField?.privileges ?? [],
        sortIndex: defaultField?.sortIndex ?? Number.MAX_SAFE_INTEGER,
      };
    })
    .sort((left, right) => {
      if (left.sortIndex !== right.sortIndex) {
        return left.sortIndex - right.sortIndex;
      }

      return left.rankCode.localeCompare(right.rankCode, 'zh-CN');
    })
    .map(({ sortIndex: _sortIndex, ...field }) => field);
}

function applyContributionTitleOverrides(
  members: ClubAdminMemberEntry[],
  fields: ClubDetailWorkbenchState['contributionTitleFields'],
): ClubAdminMemberEntry[] {
  const titleByRankCode = new Map(
    fields.map((field) => [field.rankCode, field.displayLabel]),
  );

  return members.map((member) => {
    const effectiveRankCode =
      !member.rankCode || isLegacyMemberTitle(member.rankLabel)
        ? defaultRankCodeForContribution(member.contribution)
        : member.rankCode;

    if (!effectiveRankCode) {
      return member;
    }

    const overriddenLabel = titleByRankCode.get(effectiveRankCode);

    if (!overriddenLabel || overriddenLabel === member.rankLabel) {
      return member;
    }

    return {
      ...member,
      rankCode: effectiveRankCode,
      rankLabel: overriddenLabel,
    };
  });
}

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
  const [isContributionTitleDialogOpen, setIsContributionTitleDialogOpen] =
    useState(false);
  const [isContributionTitleSubmitting, setIsContributionTitleSubmitting] =
    useState(false);
  const [clubRankTree, setClubRankTree] = useState<ClubRankNodeView[]>([]);
  const [contributionTitleRefreshKey, setContributionTitleRefreshKey] =
    useState(0);
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

  const contributionTitleFields = useMemo(
    () =>
      profile
        ? buildContributionTitleFields(
            clubMembers,
            clubRankTree,
          )
        : [],
    [clubMembers, clubRankTree, profile],
  );
  const displayClubMembers = useMemo(
    () => applyContributionTitleOverrides(clubMembers, contributionTitleFields),
    [clubMembers, contributionTitleFields],
  );

  useEffect(() => {
    if (!profile) {
      setClubRankTree([]);
      return;
    }

    let cancelled = false;

    void clubsApi
      .getClub(profile.id)
      .then((club) => {
        if (!cancelled) {
          setClubRankTree(club.rankTree ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setClubRankTree([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [contributionTitleRefreshKey, profile]);

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

    void clubsApi
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
    isContributionTitleDialogOpen,
    setIsContributionTitleDialogOpen,
    isContributionTitleSubmitting,
    setIsContributionTitleSubmitting,
    contributionTitleFields,
    setContributionTitleRefreshKey,
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
    clubMembers: displayClubMembers,
    setClubMembers,
    isClubMembersLoading,
    setIsClubMembersLoading,
    isFeaturedMember,
  };
}

export type ClubDetailData = ReturnType<typeof useClubDetailData>;
