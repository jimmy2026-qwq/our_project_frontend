import { useEffect, useMemo, useState } from 'react';

import { loadPlayerContext } from '@/features/blueprint/application-data';
import { clubsApi } from '@/api/clubs';
import type { AuthSession, PlayerProfile } from '@/domain/auth';
import type { ClubApplicationView } from '@/domain/clubs';
import type { ClubPublicProfile } from '@/domain/public';
import { useDialog, useMutationNotice } from '@/hooks';
import { upsertClubApplicationInboxItem } from '@/lib/club-applications';

import type { DetailState } from '../types';
import type { ClubAdminMemberEntry, ClubDetailWorkbenchState } from './club-detail.types';

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
  const [selectedLineupTournament, setSelectedLineupTournament] =
    useState<ClubPublicProfile['activeTournaments'][number] | null>(null);
  const [isCurrentMember, setIsCurrentMember] = useState(false);
  const [isCurrentClubAdmin, setIsCurrentClubAdmin] = useState(false);
  const [clubMemberNames, setClubMemberNames] = useState<string[]>([]);
  const [applicationInbox, setApplicationInbox] = useState<ClubApplicationView[]>([]);
  const [isInboxLoading, setIsInboxLoading] = useState(false);
  const [clubMembers, setClubMembers] = useState<ClubAdminMemberEntry[]>([]);
  const [isClubMembersLoading, setIsClubMembersLoading] = useState(false);

  const profile = state.item;

  const isFeaturedMember =
    !!session?.user.roles.isRegisteredPlayer &&
    !!profile &&
    profile.featuredPlayers.some(
      (name) => name.trim().toLowerCase() === session.user.displayName.trim().toLowerCase(),
    );

  useEffect(() => {
    if (!session?.user.roles.isRegisteredPlayer || !profile) {
      setIsCurrentMember(false);
      setIsCurrentClubAdmin(false);
      return;
    }

    let cancelled = false;
    const operatorId = session.user.operatorId ?? session.user.userId;
    const clubId = profile.id;

    const refreshMembershipStatus = () => {
      void loadPlayerContext(operatorId, session.user.displayName).then((result) => {
        if (!cancelled) {
          setIsCurrentMember(result.player?.clubIds?.includes(clubId) ?? false);
        }
      });

      void clubsApi
        .getClubs({ adminId: operatorId, limit: 100, offset: 0 })
        .then((envelope) => {
          if (!cancelled) {
            setIsCurrentClubAdmin(envelope.items.some((club) => club.id === clubId));
          }
        })
        .catch(() => {
          if (!cancelled) {
            setIsCurrentClubAdmin(false);
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
    if (!session?.user.roles.isRegisteredPlayer || !profile || !isCurrentClubAdmin) {
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
            envelope.items.map((item) => item.displayName).filter((name) => name.trim().length > 0),
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
    if (!session?.user.roles.isRegisteredPlayer || !profile || !isCurrentClubAdmin) {
      setClubMembers([]);
      setIsClubMembersLoading(false);
      return;
    }

    let cancelled = false;
    setIsClubMembersLoading(true);

    void clubsApi
      .getClubMembers(profile.id, { limit: 100, offset: 0 })
      .then(async (envelope) => {
        const members = envelope.items;
        const adminMembership = await Promise.all(
          members.map(async (member) => {
            try {
              const adminEnvelope = await clubsApi.getClubs({
                adminId: member.playerId,
                limit: 100,
                offset: 0,
              });

              return adminEnvelope.items.some((club) => club.id === profile.id);
            } catch {
              return false;
            }
          }),
        );

        if (!cancelled) {
          setClubMembers(
            members
              .map((member, index) => ({
                ...member,
                isAdmin: adminMembership[index] ?? false,
                isCurrentUser: member.playerId === (session.user.operatorId ?? session.user.userId),
              }))
              .sort((left, right) => {
                if (left.isCurrentUser !== right.isCurrentUser) {
                  return left.isCurrentUser ? -1 : 1;
                }

                if (left.isAdmin !== right.isAdmin) {
                  return left.isAdmin ? -1 : 1;
                }

                return left.displayName.localeCompare(right.displayName);
              }),
          );
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
  }, [isCurrentClubAdmin, profile, session]);

  const workbench = useMemo<ClubDetailWorkbenchState | null>(() => {
    if (!profile) {
      return null;
    }

    const isClubMember = isCurrentMember || isFeaturedMember;
    const featuredPlayerNames = Array.from(
      new Map(
        [...profile.featuredPlayers, ...clubMemberNames].map((name) => [name.trim().toLowerCase(), name]),
      ).values(),
    );
    const canApply = !!session?.user.roles.isRegisteredPlayer && !isClubMember;
    const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
    const actionableTournaments = profile.activeTournaments.filter(
      (item) => item.source === 'invited' && item.status !== 'Finished',
    );
    const canManageLineup =
      !!session?.user.roles.isRegisteredPlayer && isCurrentClubAdmin && actionableTournaments.length > 0;

    return {
      profile,
      operatorId,
      isApplicationDialogOpen,
      isLineupDialogOpen,
      selectedLineupTournament,
      isCurrentMember,
      isCurrentClubAdmin,
      clubMemberNames,
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

  async function handleReview(applicationId: string, decision: 'approve' | 'reject') {
    if (!workbench?.profile.id || !workbench.operatorId) {
      return;
    }

    const confirmed = await confirmDanger({
      title: decision === 'approve' ? 'Approve application?' : 'Reject application?',
      message:
        decision === 'approve'
          ? 'This will approve the pending club application and refresh the current club detail view.'
          : 'This will reject the pending club application and refresh the current club detail view.',
      confirmText: decision === 'approve' ? 'Approve' : 'Reject',
    });

    if (!confirmed) {
      return;
    }

    const application = workbench.applicationInbox.find((item) => item.applicationId === applicationId);

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
      successTitle: decision === 'approve' ? 'Application approved' : 'Application rejected',
      successMessage: 'The application inbox was updated successfully.',
      fallbackTitle:
        decision === 'approve'
          ? 'Application approval requires attention'
          : 'Application rejection requires attention',
      fallbackMessage:
        'The backend review request did not complete.',
    });

    setApplicationInbox((current) => current.filter((item) => item.applicationId !== applicationId));

    if (result.source === 'api') {
      onRefreshDetail?.();
    }
  }

  async function refreshClubMembers() {
    if (!profile || !isCurrentClubAdmin || !session?.user.roles.isRegisteredPlayer) {
      return;
    }

    setIsClubMembersLoading(true);

    try {
      const membersEnvelope = await clubsApi.getClubMembers(profile.id, { limit: 100, offset: 0 });
      const members = membersEnvelope.items;
      const adminMembership = await Promise.all(
        members.map(async (member) => {
          try {
            const adminEnvelope = await clubsApi.getClubs({
              adminId: member.playerId,
              limit: 100,
              offset: 0,
            });

            return adminEnvelope.items.some((club) => club.id === profile.id);
          } catch {
            return false;
          }
        }),
      );

      setClubMembers(
        members
          .map((member, index) => ({
            ...member,
            isAdmin: adminMembership[index] ?? false,
            isCurrentUser: member.playerId === (session.user.operatorId ?? session.user.userId),
          }))
          .sort((left, right) => {
            if (left.isCurrentUser !== right.isCurrentUser) {
              return left.isCurrentUser ? -1 : 1;
            }

            if (left.isAdmin !== right.isAdmin) {
              return left.isAdmin ? -1 : 1;
            }

            return left.displayName.localeCompare(right.displayName);
          }),
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
      title: 'Promote club admin?',
      message: `This will grant club admin access to ${member.displayName}.`,
      confirmText: 'Promote',
    });

    if (!confirmed) {
      return;
    }

    const result = await clubsApi.assignClubAdmin(profile.id, {
      playerId: member.playerId,
      operatorId: workbench.operatorId,
    }).then(() => ({ source: 'api' as const }));

    notifyMutationResult(result, {
      successTitle: 'Club admin assigned',
      successMessage: `${member.displayName} can now manage this club.`,
      fallbackTitle: 'Club admin update requires attention',
      fallbackMessage: 'The backend update did not complete.',
    });

    if (result.source === 'api') {
      await refreshClubMembers();
      onRefreshDetail?.();
    }
  }

  async function handleRemoveMember(member: ClubAdminMemberEntry) {
    if (!profile?.id || !workbench?.operatorId || member.isAdmin) {
      return;
    }

    const confirmed = await confirmDanger({
      title: 'Remove club member?',
      message: `This will remove ${member.displayName} from the club membership list.`,
      confirmText: 'Remove',
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
      successTitle: 'Club member removed',
      successMessage: `${member.displayName} was removed from this club.`,
      fallbackTitle: 'Club member removal requires attention',
      fallbackMessage: 'The backend update did not complete.',
    });

    if (result.source === 'api') {
      await refreshClubMembers();
      onRefreshDetail?.();
    }
  }

  return {
    workbench,
    setIsApplicationDialogOpen,
    setIsLineupDialogOpen,
    setSelectedLineupTournament,
    setIsCurrentMember,
    handleReview,
    handleAssignAdmin,
    handleRemoveMember,
  };
}
