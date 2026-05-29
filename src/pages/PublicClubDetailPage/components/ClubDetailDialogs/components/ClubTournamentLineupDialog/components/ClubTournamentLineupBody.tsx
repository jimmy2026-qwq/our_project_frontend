import { DialogBody } from '@/components/ui';

import type { EloSort } from '../objects/EloSort';
import type { MemberListItem } from '../objects/MemberListItem';
import type { MemberStatusFilter } from '../objects/MemberStatusFilter';
import { ClubTournamentLineupFilters } from './ClubTournamentLineupFilters';
import { ClubTournamentLineupMemberList } from './ClubTournamentLineupMemberList';

export function ClubTournamentLineupBody({
  isLoading,
  selectedStageId,
  stageOptions,
  statusFilter,
  eloSort,
  selectedPlayerIds,
  visibleMembers,
  onSelectedStageIdChange,
  onStatusFilterChange,
  onEloSortChange,
  onTogglePlayer,
}: {
  isLoading: boolean;
  selectedStageId: string;
  stageOptions: Array<{ stageId: string; name: string }>;
  statusFilter: MemberStatusFilter;
  eloSort: EloSort;
  selectedPlayerIds: string[];
  visibleMembers: MemberListItem[];
  onSelectedStageIdChange: (value: string) => void;
  onStatusFilterChange: (value: MemberStatusFilter) => void;
  onEloSortChange: (value: EloSort) => void;
  onTogglePlayer: (playerId: string) => void;
}) {
  return (
    <DialogBody className="px-6 py-5">
      <div className="grid gap-5">
        <ClubTournamentLineupFilters
          isLoading={isLoading}
          selectedStageId={selectedStageId}
          stageOptions={stageOptions}
          statusFilter={statusFilter}
          eloSort={eloSort}
          onSelectedStageIdChange={onSelectedStageIdChange}
          onStatusFilterChange={onStatusFilterChange}
          onEloSortChange={onEloSortChange}
        />
        <ClubTournamentLineupMemberList
          isLoading={isLoading}
          selectedPlayerIds={selectedPlayerIds}
          visibleMembers={visibleMembers}
          onTogglePlayer={onTogglePlayer}
        />
      </div>
    </DialogBody>
  );
}
