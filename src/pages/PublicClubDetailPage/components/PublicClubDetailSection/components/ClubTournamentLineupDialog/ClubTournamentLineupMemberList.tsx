import { StatusPill } from '@/components/ui';

import type { MemberListItem } from './types';
import { ClubTournamentLineupMemberCard } from './ClubTournamentLineupMemberCard';

export function ClubTournamentLineupMemberList({
  isLoading,
  selectedPlayerIds,
  visibleMembers,
  onTogglePlayer,
}: {
  isLoading: boolean;
  selectedPlayerIds: string[];
  visibleMembers: MemberListItem[];
  onTogglePlayer: (playerId: string) => void;
}) {
  return (
    <div className="grid gap-3 rounded-[22px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] p-4">
      <div className="flex items-center justify-between gap-3">
        <strong className="text-[#9ab0c1]">可参赛成员</strong>
        <StatusPill tone="info">已选：{selectedPlayerIds.length}</StatusPill>
      </div>
      {visibleMembers.length > 0 ? (
        <div className="grid max-h-[340px] gap-3 overflow-y-auto pr-1">
          {visibleMembers.map((member) => (
            <ClubTournamentLineupMemberCard
              key={member.playerId}
              member={member}
              onTogglePlayer={onTogglePlayer}
            />
          ))}
        </div>
      ) : (
        <p className="m-0 text-[#9ab0c1]">
          {isLoading
            ? '正在加载俱乐部成员和赛事赛段...'
            : '当前筛选条件下没有可参赛成员。'}
        </p>
      )}
    </div>
  );
}
