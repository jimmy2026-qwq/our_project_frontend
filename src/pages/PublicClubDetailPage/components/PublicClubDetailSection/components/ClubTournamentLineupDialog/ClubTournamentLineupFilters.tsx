import { FieldGroup, SelectField } from '@/components/ui';

import type {
  EloSort,
  MemberStatusFilter,
} from './types';

export function ClubTournamentLineupFilters({
  isLoading,
  selectedStageId,
  stageOptions,
  statusFilter,
  eloSort,
  onSelectedStageIdChange,
  onStatusFilterChange,
  onEloSortChange,
}: {
  isLoading: boolean;
  selectedStageId: string;
  stageOptions: Array<{ stageId: string; name: string }>;
  statusFilter: MemberStatusFilter;
  eloSort: EloSort;
  onSelectedStageIdChange: (value: string) => void;
  onStatusFilterChange: (value: MemberStatusFilter) => void;
  onEloSortChange: (value: EloSort) => void;
}) {
  const hasMultipleStages = stageOptions.length > 1;
  const singleStage = stageOptions[0] ?? null;

  return (
    <FieldGroup className="grid gap-4 md:grid-cols-2">
      {hasMultipleStages ? (
        <SelectField
          label="赛段"
          value={selectedStageId}
          onChange={(event) =>
            onSelectedStageIdChange(event.currentTarget.value)
          }
          disabled={isLoading}
        >
          {stageOptions.map((stage) => (
            <option key={stage.stageId} value={stage.stageId}>
              {stage.name}
            </option>
          ))}
        </SelectField>
      ) : (
        <div className="grid gap-2 rounded-[18px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
          <strong className="text-sm text-[#9ab0c1]">赛段</strong>
          <span className="text-[#f2f7fb]">
            {singleStage
              ? `${singleStage.name}（已自动选择）`
              : '当前没有可提交名单的赛段'}
          </span>
        </div>
      )}
      <SelectField
        label="成员状态"
        value={statusFilter}
        onChange={(event) =>
          onStatusFilterChange(
            event.currentTarget.value as MemberStatusFilter,
          )
        }
      >
        <option value="all">全部成员</option>
        <option value="active">仅活跃</option>
        <option value="inactive">仅非活跃</option>
      </SelectField>
      <SelectField
        label="ELO 排序"
        value={eloSort}
        onChange={(event) =>
          onEloSortChange(event.currentTarget.value as EloSort)
        }
      >
        <option value="desc">从高到低</option>
        <option value="asc">从低到高</option>
      </SelectField>
    </FieldGroup>
  );
}
