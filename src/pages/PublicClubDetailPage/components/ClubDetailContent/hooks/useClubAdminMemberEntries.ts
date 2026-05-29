import { useCallback, useEffect, useState } from 'react';

import {
  GetClubAPI,
  ListClubMemberPrivilegesAPI,
  ListClubMembersAPI,
} from '@/api/club';
import type { ClubMemberPrivilegeSnapshotView, ListEnvelope } from '@/objects';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';
import type { AuthSession } from '@/providers/auth/AuthSession';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import { hasClubAdminOverride } from '../../../functions/getClubAdminOverrides';
import type { ClubAdminMemberEntry } from '../../../objects/ClubDetail.types';
import { toPlayerProfile } from '../../../objects/ClubDetailPlayer.mappers';
import type { ClubPublicProfile } from '../../../objects/PublicClubDetailPage.types';

interface UseClubAdminMemberEntriesParams {
  profile: ClubPublicProfile | null;
  session: AuthSession | null;
  currentPlayerProfile: PlayerProfile | null;
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    const [first] = value;
    return typeof first === 'string' ? first : null;
  }

  return null;
}

async function loadClubMemberAdminEntries(
  clubId: string,
  currentOperatorId: string,
  currentPlayer: PlayerProfile | null,
): Promise<ClubAdminMemberEntry[]> {
  const [club, membersEnvelope] = await Promise.all([
    sendAPI(new GetClubAPI(clubId)).catch(() => null),
    sendAPI(new ListClubMembersAPI(clubId, { limit: 100, offset: 0 })).then(
      (envelope) => mapEnvelope(envelope, toPlayerProfile),
    ),
  ]);
  const privilegeEnvelope = await sendAPI<
    ListEnvelope<ClubMemberPrivilegeSnapshotView>
  >(new ListClubMemberPrivilegesAPI(clubId, { limit: 100, offset: 0 })).catch(
    () => null,
  );
  const members = [...membersEnvelope.items];
  const adminIds = new Set(club?.admins ?? []);
  const privilegesByPlayerId = new Map(
    (privilegeEnvelope?.items ?? []).map((snapshot) => [
      snapshot.playerId,
      snapshot,
    ]),
  );

  return members
    .map((member) => {
      const privilegeSnapshot = privilegesByPlayerId.get(member.playerId);

      return {
        ...member,
        isAdmin:
          privilegeSnapshot?.isAdmin ||
          adminIds.has(member.playerId) ||
          hasClubAdminOverride(clubId, member.playerId),
        isCurrentUser:
          (!!currentPlayer && member.playerId === currentPlayer.playerId) ||
          (!currentPlayer &&
            !!member.applicantUserId &&
            member.applicantUserId === currentOperatorId),
        contribution: privilegeSnapshot?.contribution,
        rankCode: privilegeSnapshot?.rankCode,
        rankLabel: privilegeSnapshot?.rankLabel,
        privileges: privilegeSnapshot?.privileges,
        internalTitle: normalizeOptionalString(
          privilegeSnapshot?.internalTitle,
        ),
      };
    })
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

export function useClubAdminMemberEntries({
  profile,
  session,
  currentPlayerProfile,
}: UseClubAdminMemberEntriesParams) {
  const [clubMembers, setClubMembers] = useState<ClubAdminMemberEntry[]>([]);
  const [isClubMembersLoading, setIsClubMembersLoading] = useState(false);
  const loadCurrentEntries = useCallback(async () => {
    if (!profile) {
      return [];
    }

    const currentOperatorId =
      session?.user.operatorId ?? session?.user.userId ?? '';

    return loadClubMemberAdminEntries(
      profile.id,
      currentOperatorId,
      currentPlayerProfile,
    );
  }, [currentPlayerProfile, profile, session]);

  const refreshClubMembers = useCallback(async () => {
    if (!profile) {
      return;
    }

    setIsClubMembersLoading(true);

    try {
      setClubMembers(await loadCurrentEntries());
    } catch {
      setClubMembers([]);
    } finally {
      setIsClubMembersLoading(false);
    }
  }, [loadCurrentEntries, profile]);

  useEffect(() => {
    if (!profile) {
      setClubMembers([]);
      setIsClubMembersLoading(false);
      return;
    }

    let cancelled = false;
    setIsClubMembersLoading(true);

    void loadCurrentEntries()
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
  }, [loadCurrentEntries, profile]);

  return {
    clubMembers,
    isClubMembersLoading,
    refreshClubMembers,
  };
}
