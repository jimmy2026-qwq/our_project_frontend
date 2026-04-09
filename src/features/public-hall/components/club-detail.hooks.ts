import { useEffect, useMemo, useState } from 'react';

import { clubsApi } from '@/api/clubs';
import type { AuthSession } from '@/domain/auth';
import type { ClubApplicationView } from '@/domain/clubs';
import type { ClubPublicProfile } from '@/domain/public';
import { useDialog, useMutationNotice } from '@/hooks';
import { loadPlayerContext } from '@/features/blueprint/application-data';

import type { DetailState } from '../types';
import type { ClubDetailWorkbenchState } from './club-detail.types';

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
    isApplicationDialogOpen,
    isCurrentClubAdmin,
    isCurrentMember,
    isFeaturedMember,
    isInboxLoading,
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
      title: decision === 'approve' ? 'é–«æ°³ç¹ƒæ©æ¬æ½¯é¢å® î‡¬é”›?' : 'éŽ·æŽ”ç²·æ©æ¬æ½¯é¢å® î‡¬é”›?',
      message:
        decision === 'approve'
          ? 'æ©æ¬Žç´°éŽ¶å©‚ç¶‹é“å¶‡æ•µç’‡é”‹çˆ£ç’é¢è´Ÿé–«æ°³ç¹ƒé”›å±½è‹Ÿé’é”‹æŸŠæ·‡å˜ç®°é–®ã„§æ•µç’‡å³°åžªç›ã„£â‚¬?'
          : 'æ©æ¬Žç´°éŽ¶å©‚ç¶‹é“å¶‡æ•µç’‡é”‹çˆ£ç’é¢è´ŸéŽ·æŽ”ç²·é”›å±½è‹Ÿé’é”‹æŸŠæ·‡å˜ç®°é–®ã„§æ•µç’‡å³°åžªç›ã„£â‚¬?',
      confirmText: decision === 'approve' ? 'é–«æ°³ç¹ƒ' : 'éŽ·æŽ”ç²·',
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
      .then(() => ({ source: 'api' as const }))
      .catch(() => ({
        source: 'mock' as const,
        warning:
          'ç€¹â„ƒå£’ç’‡é”‹çœ°éˆî…åžšé”ç†»ç¹‘é¥çƒ‡ç´é’æ¥„ã€ƒçå—•ç²Žé‹æ°­æ¹°é¦æ¿åŸ›é‚èˆ¬â‚¬?',
      }));

    notifyMutationResult(result, {
      successTitle: decision === 'approve' ? 'é¢å® î‡¬å®¸æŸ¥â‚¬æ°³ç¹ƒ' : 'é¢å® î‡¬å®¸å‰å«†ç¼?',
      successMessage: 'æ·‡å˜ç®°é–®ã„§æ•µç’‡å³°åžªç›ã„¥å‡¡é’é”‹æŸŠéŠ†?',
      fallbackTitle:
        decision === 'approve'
          ? 'é¢å® î‡¬å®¸æŸ¥â‚¬æ°³ç¹ƒé”›å æ´–é–«â‚¬é”›?'
          : 'é¢å® î‡¬å®¸å‰å«†ç¼æ¿“ç´™é¥ç‚ºâ‚¬â‚¬é”›?',
      fallbackMessage:
        'ç€¹â„ƒå£’å®¸æ’çš¾ç’‡æ›Ÿå¢½ç›å²‹ç´æµ£å——ç¶‹é“å¶…å½§ç€¹å±¾åžšæµœå—˜æ¹°é¦æ¿åŸ›é‚èˆ¬â‚¬?',
    });

    setApplicationInbox((current) => current.filter((item) => item.applicationId !== applicationId));

    if (result.source === 'api') {
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
  };
}
