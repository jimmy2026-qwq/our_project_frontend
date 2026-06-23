import { PlayerStatus } from '@/objects';
import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';

import { EloSort } from '@/pages/PublicClubDetailPage/components/ClubDetailDialogs/components/ClubTournamentLineupDialog/objects/EloSort';
import type { MemberListItem } from '../objects/MemberListItem';
import { MemberStatusFilter } from '@/pages/PublicClubDetailPage/components/ClubDetailDialogs/components/ClubTournamentLineupDialog/objects/MemberStatusFilter';

const activePlayerStatusValue = PlayerStatus.Active.toLowerCase();

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
    const normalizedStatus =
      member.playerStatus?.toLowerCase() ?? activePlayerStatusValue;

    if (statusFilter === MemberStatusFilter.Active) {
      return normalizedStatus === activePlayerStatusValue;
    }

    if (statusFilter === MemberStatusFilter.Inactive) {
      return normalizedStatus !== activePlayerStatusValue;
    }

    return true;
  });

  const withSelection: MemberListItem[] = filtered.map((member) => ({
    ...member,
    isSelected: selectedPlayerIds.includes(member.playerId),
    isCurrentUser: member.playerId === operatorId,
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
      return eloSort === EloSort.Desc ? eloDelta : -eloDelta;
    }

    return left.displayName.localeCompare(right.displayName, 'zh-CN');
  });
}
