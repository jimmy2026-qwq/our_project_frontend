import { useEffect, useState } from 'react';

import { GetClubAPI } from '@/api/club';
import type { AuthSession } from '@/providers/auth/AuthSession';
import {
  hasClubAdminOverride,
  type ClubApplication,
} from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';
import { sendAPI } from '@/system/api';

import {
  loadPlayerContext,
  loadTrackedApplication,
} from '../../../objects/application-data';
import type { ClubPublicProfile } from '../../../objects/types';

interface UseClubDetailMembershipParams {
  profile: ClubPublicProfile | null;
  session: AuthSession | null;
  isApplicationDialogOpen: boolean;
}

async function resolveClubAdminAccess(
  clubId: string,
  playerId: string,
) {
  try {
    const club = await sendAPI(new GetClubAPI(clubId));

    if (club.admins?.includes(playerId)) {
      return true;
    }
  } catch {
    // Fall through to local override.
  }

  return hasClubAdminOverride(clubId, playerId);
}

export function useClubDetailMembership({
  profile,
  session,
  isApplicationDialogOpen,
}: UseClubDetailMembershipParams) {
  const [isCurrentMember, setIsCurrentMember] = useState(false);
  const [isCurrentClubAdmin, setIsCurrentClubAdmin] = useState(false);
  const [currentPlayerProfile, setCurrentPlayerProfile] =
    useState<PlayerProfile | null>(null);
  const [currentApplicationStatus, setCurrentApplicationStatus] = useState<
    ClubApplication['status'] | null
  >(null);

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

  return {
    isCurrentMember,
    setIsCurrentMember,
    isCurrentClubAdmin,
    currentPlayerProfile,
    currentApplicationStatus,
    setCurrentApplicationStatus,
    isFeaturedMember,
  };
}
