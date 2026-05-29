import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

import type { EloSort } from '../objects/EloSort';
import type { MemberListItem } from '../objects/MemberListItem';
import type { MemberStatusFilter } from '../objects/MemberStatusFilter';

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
