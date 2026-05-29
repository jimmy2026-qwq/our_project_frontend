import { StatusPill } from '@/components/ui';

import type { MemberListItem } from '../objects/MemberListItem';

function getPlayerStatusLabel(status?: string) {
  switch (status) {
    case 'Active':
      return '活跃';
    case 'Inactive':
      return '停用';
    case 'Banned':
      return '封禁';
    default:
      return status || '活跃';
  }
}

export function ClubTournamentLineupMemberCard({
  member,
  onTogglePlayer,
}: {
  member: MemberListItem;
  onTogglePlayer: (playerId: string) => void;
}) {
  return (
    <div className="grid gap-3 rounded-[18px] border border-[rgba(176,223,229,0.14)] px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <span className="grid gap-1">
          <strong className="text-[#9ab0c1]">{member.displayName}</strong>
          <span className="text-sm text-[#9ab0c1]">
            ELO {member.elo ?? 0} / {getPlayerStatusLabel(member.playerStatus)}
          </span>
        </span>
        <div className="flex items-center gap-2">
          {member.isCurrentUser ? (
            <StatusPill tone="success">当前用户</StatusPill>
          ) : null}
          {member.isSelected ? (
            <StatusPill tone="success">已选择</StatusPill>
          ) : null}
        </div>
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#f2f7fb]">
        <input
          type="checkbox"
          checked={member.isSelected}
          onChange={() => onTogglePlayer(member.playerId)}
        />
        将该成员加入参赛名单
      </label>
    </div>
  );
}
