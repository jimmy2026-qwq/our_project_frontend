import { ListClubMembersAPI } from '@/api/club';
import { GetCurrentPlayerAPI } from '@/api/player';
import { mapClubMember } from '@/pages/objects/club';
import { mapPlayerProfile } from '@/pages/objects/player';
import type { PlayerProfile } from '@/pages/objects/player';
import { sendAPI } from '@/system/api';
import { mapEnvelope } from '@/system/api/http';

import type { EloSort, MemberListItem, MemberStatusFilter } from '../types';

export async function loadClubLineupMembers(
  clubId: string,
  operatorId: string,
) {
  const envelope = await sendAPI(
    new ListClubMembersAPI(clubId, { limit: 100, offset: 0 }),
  ).then((result) => mapEnvelope(result, mapClubMember));
  const items = [...envelope.items];

  if (!operatorId) {
    return items;
  }

  try {
    const currentPlayer = await sendAPI(
      new GetCurrentPlayerAPI(operatorId),
    ).then(mapPlayerProfile);

    if (
      !items.some(
        (member) =>
          member.playerId === currentPlayer.playerId ||
          (!!member.applicantUserId &&
            member.applicantUserId === currentPlayer.applicantUserId),
      )
    ) {
      items.unshift(currentPlayer);
    }
  } catch {
    // Keep the club member list from the main endpoint when this lookup fails.
  }

  return items;
}

export function getVisibleLineupMembers({
  members,
  operatorId,
  selectedPlayerIds,
  statusFilter,
  eloSort,
}: {
  members: PlayerProfile[];
  operatorId: string;
  selectedPlayerIds: string[];
  statusFilter: MemberStatusFilter;
  eloSort: EloSort;
}) {
  const filtered = members.filter((member) => {
    const normalizedStatus = member.playerStatus?.toLowerCase() ?? 'active';

    if (statusFilter === 'active') {
      return normalizedStatus === 'active';
    }

    if (statusFilter === 'inactive') {
      return normalizedStatus !== 'active';
    }

    return true;
  });

  const withSelection: MemberListItem[] = filtered.map((member) => ({
    ...member,
    isSelected: selectedPlayerIds.includes(member.playerId),
    isCurrentUser:
      member.playerId === operatorId ||
      (!!member.applicantUserId && member.applicantUserId === operatorId),
  }));

  return withSelection.sort((left, right) => {
    if (left.isCurrentUser !== right.isCurrentUser) {
      return left.isCurrentUser ? -1 : 1;
    }

    if (left.isSelected !== right.isSelected) {
      return left.isSelected ? -1 : 1;
    }

    const eloDelta = (right.elo ?? 0) - (left.elo ?? 0);

    if (eloDelta !== 0) {
      return eloSort === 'desc' ? eloDelta : -eloDelta;
    }

    return left.displayName.localeCompare(right.displayName, 'zh-CN');
  });
}
