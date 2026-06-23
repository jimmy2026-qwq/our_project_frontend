import { WorkbenchContextPanel, SelectField, TextInputField } from '@/components/ui';

import { AppealStatus, TableStatus } from '@/objects';
import type { AppealSummary } from '@/pages/shared_objects/tournament/AppealSummary';

import { getActiveTournament } from '../functions/getTournamentOpsState';
import type { TournamentContext } from '../objects/TournamentContext';
import type { TournamentOpsState } from '../objects/TournamentOpsState';

interface TournamentOpsFiltersPanelProps {
  tournaments: TournamentContext[];
  activeTournament: TournamentContext;
  state: TournamentOpsState;
  hideTournamentSelect: boolean;
  onReload: () => void;
  onStateChange: (patch: Partial<TournamentOpsState>) => void;
}

/** 赛事运营页顶部选择赛事、阶段和刷新数据的筛选面板。 */
export function TournamentOpsFiltersPanel({
  tournaments,
  activeTournament,
  state,
  hideTournamentSelect,
  onReload,
  onStateChange,
}: TournamentOpsFiltersPanelProps) {
  return (
    <WorkbenchContextPanel
      className="text-[#c7d6e2]"
      title="筛选条件"
      description="选择阶段，并按牌桌、玩家和申诉条件筛选当前视图。"
      onReload={onReload}
    >
      {!hideTournamentSelect ? (
        <SelectField
          label="赛事"
          value={state.tournamentId}
          onChange={(event) => {
            const nextTournament = getActiveTournament(
              tournaments,
              event.currentTarget.value,
            );
            onStateChange({
              tournamentId: nextTournament.id,
              stageId: nextTournament.stages[0]?.id ?? '',
            });
          }}
        >
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.name}
            </option>
          ))}
        </SelectField>
      ) : null}
      <SelectField
        label="阶段"
        value={state.stageId}
        onChange={(event) =>
          onStateChange({ stageId: event.currentTarget.value })
        }
      >
        {activeTournament.stages.map((stage) => (
          <option key={stage.id} value={stage.id}>
            {stage.name}
          </option>
        ))}
      </SelectField>
      <SelectField
        label="牌桌状态"
        value={state.tableStatus ?? ''}
        onChange={(event) =>
          onStateChange({
            tableStatus:
              event.currentTarget.value === ''
                ? undefined
                : (event.currentTarget.value as TableStatus),
          })
        }
      >
        <option value="">全部</option>
        <option value={TableStatus.WaitingPreparation}>等待开始</option>
        <option value={TableStatus.InProgress}>对局中</option>
        <option value={TableStatus.Scoring}>结算中</option>
        <option value={TableStatus.Archived}>已结束</option>
        <option value={TableStatus.AppealInProgress}>申诉处理中</option>
      </SelectField>
      <TextInputField
        label="玩家编号"
        value={state.playerId}
        placeholder="player-123"
        onChange={(event) =>
          onStateChange({ playerId: event.currentTarget.value.trim() })
        }
      />
      <SelectField
        label="申诉状态"
        value={state.appealStatus ?? ''}
        onChange={(event) =>
          onStateChange({
            appealStatus:
              event.currentTarget.value === ''
                ? undefined
                : (event.currentTarget.value as AppealSummary['status']),
          })
        }
      >
        <option value="">全部</option>
        <option value={AppealStatus.Open}>处理中</option>
        <option value={AppealStatus.Resolved}>已处理</option>
        <option value={AppealStatus.Rejected}>已驳回</option>
        <option value={AppealStatus.Escalated}>已升级</option>
      </SelectField>
    </WorkbenchContextPanel>
  );
}
