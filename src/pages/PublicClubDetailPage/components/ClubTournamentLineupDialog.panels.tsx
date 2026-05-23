import { FieldGroup, SelectField } from '@/components/ui';
import { ActionButton } from '@/components/ui';
import {
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  StatusPill,
} from '@/components/ui';

import type {
  ClubTournamentItem,
  EloSort,
  MemberListItem,
  MemberStatusFilter,
} from '../objects/ClubTournamentLineupDialog.types';

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

export function ClubTournamentLineupHeader({
  tournament,
}: {
  tournament: ClubTournamentItem | null;
}) {
  return (
    <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
      <DialogTitle>提交俱乐部参赛名单</DialogTitle>
      <DialogDescription>
        请确认受邀赛事、选择赛段，并提交代表俱乐部出战的参赛成员。 当前赛事：
        {tournament?.name ?? '暂无'}。
      </DialogDescription>
    </DialogHeader>
  );
}

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
  const hasMultipleStages = stageOptions.length > 1;
  const singleStage = stageOptions[0] ?? null;

  return (
    <DialogBody className="px-6 py-5">
      <div className="grid gap-5">
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
              <strong className="text-sm text-[#9ab0c1]">
                赛段
              </strong>
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

        <div className="grid gap-3 rounded-[22px] border border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] p-4">
          <div className="flex items-center justify-between gap-3">
            <strong className="text-[#9ab0c1]">可参赛成员</strong>
            <StatusPill tone="info">
              已选：{selectedPlayerIds.length}
            </StatusPill>
          </div>
          {visibleMembers.length > 0 ? (
            <div className="grid max-h-[340px] gap-3 overflow-y-auto pr-1">
              {visibleMembers.map((member) => (
                <div
                  key={member.playerId}
                  className="grid gap-3 rounded-[18px] border border-[rgba(176,223,229,0.14)] px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid gap-1">
                      <strong className="text-[#9ab0c1]">
                        {member.displayName}
                      </strong>
                      <span className="text-sm text-[#9ab0c1]">
                        ELO {member.elo ?? 0} /{' '}
                        {getPlayerStatusLabel(member.playerStatus)}
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
      </div>
    </DialogBody>
  );
}

export function ClubTournamentLineupFooter({
  isSubmitting,
  selectedPlayerIds,
  onSubmit,
  onClose,
}: {
  isSubmitting: boolean;
  selectedPlayerIds: string[];
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
      <div className="grid w-full gap-3 sm:grid-cols-2">
        <ActionButton
          onClick={onSubmit}
          disabled={isSubmitting || selectedPlayerIds.length === 0}
        >
          {isSubmitting ? '正在提交名单...' : '提交名单'}
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={onClose}
          disabled={isSubmitting}
        >
          关闭
        </ActionButton>
      </div>
    </DialogFooter>
  );
}
