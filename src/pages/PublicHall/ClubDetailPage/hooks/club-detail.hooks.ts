import { useEffect, useMemo, useState } from 'react';

import { clubsApi } from '@/pages/PublicHall/objects/data.transport';
import type { AuthSession } from '@/providers/auth/AuthSession';
import type { ClubApplication, ClubApplicationView } from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';
import type { ClubPublicProfile } from '@/pages/PublicHall/objects';
import {
  loadPlayerContext,
  loadTrackedApplication,
} from '@/pages/PublicHall/objects/application-data';
import { useDialog } from '@/app/dialog/useDialog';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import {
  hasClubAdminOverride,
  upsertClubAdminOverride,
} from '@/pages/objects/club';
import { upsertClubApplicationInboxItem } from '@/pages/objects/club';

import type { DetailState } from '@/pages/PublicHall/objects/types';
import type {
  ClubAdminMemberEntry,
  ClubDetailWorkbenchState,
} from '../objects/club-detail.types';

interface UseClubDetailWorkbenchParams {
  state: DetailState<ClubPublicProfile>;
  session: AuthSession | null;
  onRefreshDetail?: () => void;
}

async function resolveClubAdminAccess(clubId: string, playerId: string) {
  try {
    const club = await clubsApi.getClub(clubId);

    if (club.admins?.includes(playerId)) {
      return true;
    }
  } catch {
    // Fall through to local override.
  }

  if (hasClubAdminOverride(clubId, playerId)) {
    return true;
  }

  return false;
}

async function loadClubMemberAdminEntries(
  clubId: string,
  currentOperatorId: string,
  currentPlayer: PlayerProfile | null,
): Promise<ClubAdminMemberEntry[]> {
  const [club, membersEnvelope] = await Promise.all([
    clubsApi.getClub(clubId).catch(() => null),
    clubsApi.getClubMembers(clubId, { limit: 100, offset: 0 }),
  ]);
  const members = [...membersEnvelope.items];
  const adminIds = new Set(club?.admins ?? []);

  if (
    currentPlayer &&
    !members.some(
      (member) =>
        member.playerId === currentPlayer.playerId ||
        (!!member.applicantUserId &&
          member.applicantUserId === currentPlayer.applicantUserId),
    )
  ) {
    members.unshift(currentPlayer);
  }

  return members
    .map((member) => ({
      ...member,
      isAdmin:
        adminIds.has(member.playerId) ||
        hasClubAdminOverride(clubId, member.playerId),
      isCurrentUser:
        (!!currentPlayer && member.playerId === currentPlayer.playerId) ||
        (!currentPlayer &&
          !!member.applicantUserId &&
          member.applicantUserId === currentOperatorId),
    }))
    .sort((left, right) => {
      if (left.isCurrentUser !== right.isCurrentUser) {
        return left.isCurrentUser ? -1 : 1;
      }

      if (left.isAdmin !== right.isAdmin) {
        return left.isAdmin ? -1 : 1;
      }

      return left.displayName.localeCompare(right.displayName);
    });
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
    if (
      !session?.user.roles.isRegisteredPlayer ||
      !profile ||
      !isCurrentClubAdmin
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
  }, [isCurrentClubAdmin, profile, session]);

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
    if (
      !session?.user.roles.isRegisteredPlayer ||
      !profile ||
      !isCurrentClubAdmin
    ) {
      setClubMembers([]);
      setIsClubMembersLoading(false);
      return;
    }

    let cancelled = false;
    const currentOperatorId = session.user.operatorId ?? session.user.userId;
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
  }, [currentPlayerProfile, isCurrentClubAdmin, profile, session]);

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
      isCurrentMember,
      isCurrentClubAdmin,
      clubMemberNames,
      currentApplicationStatus,
      applicationInbox,
      isInboxLoading,
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
    clubMemberNames,
    clubMembers,
    currentApplicationStatus,
    isApplicationDialogOpen,
    isCurrentClubAdmin,
    isCurrentMember,
    isFeaturedMember,
    isInboxLoading,
    isClubMembersLoading,
    isLineupDialogOpen,
    profile,
    selectedLineupTournament,
    session,
  ]);

  async function handleReview(
    applicationId: string,
    decision: 'approve' | 'reject',
  ) {
    if (!workbench?.profile.id || !workbench.operatorId) {
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

  async function refreshClubMembers() {
    if (
      !profile ||
      !isCurrentClubAdmin ||
      !session?.user.roles.isRegisteredPlayer
    ) {
      return;
    }

    setIsClubMembersLoading(true);

    try {
      const currentOperatorId = session.user.operatorId ?? session.user.userId;
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
    if (!profile?.id || !workbench?.operatorId) {
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
    if (!profile?.id || !workbench?.operatorId || member.isAdmin) {
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
    setIsCurrentMember,
    handleApplicationStatusChange,
    handleReview,
    handleAssignAdmin,
    handleRemoveMember,
  };
}
