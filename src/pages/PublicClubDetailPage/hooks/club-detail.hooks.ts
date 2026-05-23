import { useEffect, useMemo, useState } from 'react';

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
import { useDialog } from '@/app/dialog/useDialog';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import {
  hasClubAdminOverride,
  upsertClubAdminOverride,
} from '@/pages/objects/club';
import { upsertClubApplicationInboxItem } from '@/pages/objects/club';

import type { DetailState } from '@/pages/PublicShared/objects/types';
import type {
  ClubAdminMemberEntry,
  ClubDetailWorkbenchState,
} from '../objects/club-detail.types';
import {
  loadClubMemberAdminEntries,
  resolveClubAdminAccess,
} from '../objects/club-detail.workbench';

interface UseClubDetailWorkbenchParams {
  state: DetailState<ClubPublicProfile>;
  session: AuthSession | null;
  onRefreshDetail?: () => void;
}

export function useClubDetailWorkbench({
  state,
  session,
  onRefreshDetail,
}: UseClubDetailWorkbenchParams) {
  const { confirmDanger } = useDialog();
  const { notifyMutationResult } = useMutationNotice();
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

  const profile = state.item;

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

  const workbench = useMemo<ClubDetailWorkbenchState | null>(() => {
    if (!profile) {
      return null;
    }

    const isClubMember = isCurrentMember || isFeaturedMember;
    const featuredPlayerNames = Array.from(
      new Map(
        [...profile.featuredPlayers, ...clubMemberNames].map((name) => [
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
      isApplicationDialogOpen,
      isLineupDialogOpen,
      selectedLineupTournament,
      isContributionDialogOpen,
      selectedContributionMember,
      isContributionSubmitting,
      isTitleDialogOpen,
      selectedTitleMember,
      isTitleSubmitting,
      isCurrentMember,
      isCurrentClubAdmin,
      clubMemberNames,
      currentApplicationStatus,
      applicationInbox,
      isInboxLoading,
      contributionChanges,
      isContributionChangesLoading,
      canViewContributionChanges,
      canReviewApplications,
      canAssignAdmins,
      canAdjustContributions,
      canEditTitles,
      canRemoveMembers,
      clubMembers,
      isClubMembersLoading,
      isFeaturedMember,
      isClubMember,
      featuredPlayerNames,
      canApply,
      actionableTournaments,
      canManageLineup,
    };
  }, [
    applicationInbox,
    canAdjustContributions,
    canAssignAdmins,
    canEditTitles,
    canRemoveMembers,
    canReviewApplications,
    canViewContributionChanges,
    clubMemberNames,
    clubMembers,
    contributionChanges,
    currentApplicationStatus,
    isApplicationDialogOpen,
    isContributionDialogOpen,
    isContributionChangesLoading,
    isContributionSubmitting,
    isCurrentClubAdmin,
    isCurrentMember,
    isFeaturedMember,
    isInboxLoading,
    isClubMembersLoading,
    isLineupDialogOpen,
    isTitleDialogOpen,
    isTitleSubmitting,
    profile,
    selectedContributionMember,
    selectedLineupTournament,
    selectedTitleMember,
    session,
  ]);

  async function handleReview(
    applicationId: string,
    decision: 'approve' | 'reject',
  ) {
    if (!workbench?.profile.id || !workbench.operatorId || !canReviewApplications) {
      return;
    }

    const confirmed = await confirmDanger({
      title: decision === 'approve' ? '确认通过申请？' : '确认拒绝申请？',
      message:
        decision === 'approve'
          ? '这会立刻通过当前待处理申请，并把它从申请列表里移除。'
          : '这会立刻拒绝当前待处理申请，并把它从申请列表里移除。',
      confirmText: decision === 'approve' ? '通过' : '拒绝',
    });

    if (!confirmed) {
      return;
    }

    const application = workbench.applicationInbox.find(
      (item) => item.applicationId === applicationId,
    );

    const result = await clubsApi
      .reviewClubApplication(workbench.profile.id, applicationId, {
        operatorId: workbench.operatorId,
        decision,
        note: `${decision}d from club detail`,
        ...(decision === 'approve' && application?.applicant.playerId
          ? { playerId: application.applicant.playerId }
          : {}),
      })
      .then((reviewedApplication) => {
        upsertClubApplicationInboxItem({
          id: reviewedApplication.applicationId,
          clubId: reviewedApplication.clubId,
          clubName: reviewedApplication.clubName,
          operatorId:
            reviewedApplication.applicant.playerId ||
            reviewedApplication.applicant.applicantUserId ||
            '',
          applicantName: reviewedApplication.applicant.displayName,
          message: reviewedApplication.message,
          status: reviewedApplication.status,
          submittedAt: reviewedApplication.submittedAt,
          source: 'api',
        });

        return { source: 'api' as const };
      });

    notifyMutationResult(result, {
      successTitle: decision === 'approve' ? '申请已通过' : '申请已拒绝',
      successMessage: '申请列表已经更新。',
      fallbackTitle:
        decision === 'approve'
          ? '通过申请需要人工确认'
          : '拒绝申请需要人工确认',
      fallbackMessage: '后端处理这次申请时没有完全成功。',
    });

    setApplicationInbox((current) =>
      current.filter((item) => item.applicationId !== applicationId),
    );

    if (decision === 'reject') {
      setCurrentApplicationStatus('Rejected');
    }
  }

  async function handleAcceptTournamentInvitation(
    tournament: ClubPublicProfile['activeTournaments'][number],
  ) {
    if (!workbench?.profile.id || !workbench.operatorId) {
      return;
    }

    await clubsApi.acceptClubTournament(
      workbench.profile.id,
      tournament.id,
      workbench.operatorId,
    );

    notifyMutationResult(
      { source: 'api' as const },
      {
        successTitle: '已通过赛事邀请',
        successMessage: `${workbench.profile.name} 已加入 ${tournament.name}。`,
        fallbackTitle: '赛事邀请处理需要关注',
        fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
      },
    );

    onRefreshDetail?.();
  }

  async function handleDeclineTournamentInvitation(
    tournament: ClubPublicProfile['activeTournaments'][number],
  ) {
    if (!workbench?.profile.id || !workbench.operatorId) {
      return;
    }

    const confirmed = await confirmDanger({
      title: '拒绝赛事邀请？',
      message: `这会拒绝 ${tournament.name} 对 ${workbench.profile.name} 的参赛邀请。`,
      confirmText: '确认拒绝',
    });

    if (!confirmed) {
      return;
    }

    await clubsApi.declineClubTournament(
      workbench.profile.id,
      tournament.id,
      workbench.operatorId,
    );

    notifyMutationResult(
      { source: 'api' as const },
      {
        successTitle: '已拒绝赛事邀请',
        successMessage: `${tournament.name} 的邀请已经处理。`,
        fallbackTitle: '赛事邀请处理需要关注',
        fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
      },
    );

    onRefreshDetail?.();
  }

  async function refreshClubMembers() {
    if (!profile) {
      return;
    }

    setIsClubMembersLoading(true);

    try {
      const currentOperatorId =
        session?.user.operatorId ?? session?.user.userId ?? '';
      setClubMembers(
        await loadClubMemberAdminEntries(
          profile.id,
          currentOperatorId,
          currentPlayerProfile,
        ),
      );
    } finally {
      setIsClubMembersLoading(false);
    }
  }

  async function handleAssignAdmin(member: PlayerProfile) {
    if (!profile?.id || !workbench?.operatorId || !canAssignAdmins) {
      return;
    }

    const confirmed = await confirmDanger({
      title: '设为管理员？',
      message: `这会授予 ${member.displayName} 俱乐部管理员权限。`,
      confirmText: '确认设为管理员',
    });

    if (!confirmed) {
      return;
    }

    const updatedClub = await clubsApi.assignClubAdmin(profile.id, {
      playerId: member.playerId,
      operatorId: workbench.operatorId,
    });

    notifyMutationResult(
      { source: 'api' as const },
      {
        successTitle: '管理员设置成功',
        successMessage: `${member.displayName} 现在可以管理该俱乐部。`,
        fallbackTitle: '管理员设置需要关注',
        fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
      },
    );

    upsertClubAdminOverride(profile.id, member.playerId);
    const updatedAdminIds = new Set(updatedClub.admins ?? []);
    setClubMembers((current) =>
      current
        .map((entry) => ({
          ...entry,
          isAdmin:
            updatedAdminIds.has(entry.playerId) ||
            hasClubAdminOverride(profile.id, entry.playerId),
        }))
        .sort((left, right) => {
          if (left.isCurrentUser !== right.isCurrentUser) {
            return left.isCurrentUser ? -1 : 1;
          }

          if (left.isAdmin !== right.isAdmin) {
            return left.isAdmin ? -1 : 1;
          }

          return left.displayName.localeCompare(right.displayName, 'zh-CN');
        }),
    );
    await refreshClubMembers();
  }

  async function handleRemoveMember(member: ClubAdminMemberEntry) {
    if (
      !profile?.id ||
      !workbench?.operatorId ||
      member.isAdmin ||
      !canRemoveMembers
    ) {
      return;
    }

    const confirmed = await confirmDanger({
      title: '移出俱乐部成员？',
      message: `这会将 ${member.displayName} 从俱乐部成员列表中移除。`,
      confirmText: '确认移除',
    });

    if (!confirmed) {
      return;
    }

    const result = await clubsApi
      .removeClubMember(profile.id, member.playerId, {
        operatorId: workbench.operatorId,
      })
      .then(() => ({ source: 'api' as const }));

    notifyMutationResult(result, {
      successTitle: '成员已移除',
      successMessage: `${member.displayName} 已从该俱乐部移除。`,
      fallbackTitle: '移除成员需要关注',
      fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
    });

    if (result.source === 'api') {
      await refreshClubMembers();
      onRefreshDetail?.();
    }
  }

  async function handleAdjustContribution(
    member: ClubAdminMemberEntry,
    delta: number,
    note?: string,
  ) {
    if (!profile?.id || !workbench?.operatorId || !canAdjustContributions) {
      return;
    }

    setIsContributionSubmitting(true);

    try {
      await clubsApi.adjustClubMemberContribution(profile.id, {
        playerId: member.playerId,
        operatorId: workbench.operatorId,
        delta,
        note: note?.trim() || undefined,
      });

      notifyMutationResult(
        { source: 'api' as const },
        {
          successTitle: '贡献值已更新',
          successMessage: `${member.displayName} 的贡献值变化已提交。`,
          fallbackTitle: '贡献值更新需要关注',
          fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
        },
      );

      setIsContributionDialogOpen(false);
      setSelectedContributionMember(null);
      setContributionChangesRefreshKey((current) => current + 1);
      await refreshClubMembers();
      onRefreshDetail?.();
    } finally {
      setIsContributionSubmitting(false);
    }
  }

  async function handleUpdateTitle(
    member: ClubAdminMemberEntry,
    nextTitle: string,
  ) {
    if (!profile?.id || !workbench?.operatorId || !canEditTitles) {
      return;
    }

    const normalizedTitle = nextTitle.trim();
    setIsTitleSubmitting(true);

    try {
      if (normalizedTitle) {
        await clubsApi.assignClubTitle(profile.id, {
          playerId: member.playerId,
          operatorId: workbench.operatorId,
          title: normalizedTitle,
        });
      } else {
        await clubsApi.clearClubTitle(profile.id, member.playerId, {
          operatorId: workbench.operatorId,
        });
      }

      notifyMutationResult(
        { source: 'api' as const },
        {
          successTitle: normalizedTitle ? '头衔已更新' : '头衔已清除',
          successMessage: `${member.displayName} 的专属头衔已经更新。`,
          fallbackTitle: '头衔更新需要关注',
          fallbackMessage: '后端更新没有成功完成，请稍后刷新确认。',
        },
      );

      setIsTitleDialogOpen(false);
      setSelectedTitleMember(null);
      await refreshClubMembers();
      onRefreshDetail?.();
    } finally {
      setIsTitleSubmitting(false);
    }
  }

  function handleApplicationStatusChange(
    status: ClubApplication['status'] | null,
  ) {
    setCurrentApplicationStatus(status);
  }

  return {
    workbench,
    setIsApplicationDialogOpen,
    setIsLineupDialogOpen,
    setSelectedLineupTournament,
    setIsContributionDialogOpen,
    setSelectedContributionMember,
    setIsTitleDialogOpen,
    setSelectedTitleMember,
    setIsCurrentMember,
    handleApplicationStatusChange,
    handleReview,
    handleAcceptTournamentInvitation,
    handleDeclineTournamentInvitation,
    handleAssignAdmin,
    handleRemoveMember,
    handleAdjustContribution,
    handleUpdateTitle,
  };
}
