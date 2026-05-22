import type { PlayerProfile } from '@/pages/objects/player';
import {
  hasClubAdminOverride,
} from '@/pages/objects/club';
import { clubsApi } from '@/pages/PublicHall/objects/data.transport';

import type { ClubAdminMemberEntry } from './club-detail.types';

export async function resolveClubAdminAccess(
  clubId: string,
  playerId: string,
) {
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

export async function loadClubMemberAdminEntries(
  clubId: string,
  currentOperatorId: string,
  currentPlayer: PlayerProfile | null,
): Promise<ClubAdminMemberEntry[]> {
  const [club, membersEnvelope] = await Promise.all([
    clubsApi.getClub(clubId).catch(() => null),
    clubsApi.getClubMembers(clubId, { limit: 100, offset: 0 }),
  ]);
  const privilegeEnvelope = await clubsApi
    .getClubMemberPrivileges(clubId, { limit: 100, offset: 0 })
    .catch(() => null);
  const members = [...membersEnvelope.items];
  const adminIds = new Set(club?.admins ?? []);
  const privilegesByPlayerId = new Map(
    (privilegeEnvelope?.items ?? []).map((snapshot) => [
      snapshot.playerId,
      snapshot,
    ]),
  );

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
        internalTitle: privilegeSnapshot?.internalTitle ?? null,
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
