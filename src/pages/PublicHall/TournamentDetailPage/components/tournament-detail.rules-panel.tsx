import { Button, DetailCard, DetailList, DetailListItem, StatusPill } from '@/components/ui';
import type { TournamentDetailWorkbenchState } from '../objects/tournament-detail.types';
import {
  describeAdvancementRule,
  describeRuleDetails,
  getCurrentRuleStage,
  getRuleSummaryLabel,
  getTournamentFormatLabel,
} from '../objects/tournament-detail.rules';
import { getStageStatusLabel } from '@/pages/PublicHall/objects/utils';
import { getStatusTone } from '@/pages/PublicHall/components/shared.status';

export function TournamentCurrentRulesPanel({
  workbench,
  onOpenRulesDialog,
}: {
  workbench: TournamentDetailWorkbenchState;
  onOpenRulesDialog: () => void;
}) {
  const stage = getCurrentRuleStage(workbench.profile);
  const details = describeRuleDetails(stage);
  const actionLabel = stage ? '修改规则' : '创建规则';

  return (
    <DetailCard
      title={
        <span className="flex flex-wrap items-center gap-3 text-[1.25rem] font-semibold">
          <span>当前阶段规则</span>
          {workbench.canManageTournament ? (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenRulesDialog}
              disabled={workbench.isSubmittingTournamentAction}
            >
              {actionLabel}
            </Button>
          ) : null}
        </span>
      }
    >
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <strong className="text-[#f2f7fb]">
            {stage?.name ?? '尚未创建赛段'}
          </strong>
          {stage ? (
            <>
              <StatusPill tone={getStatusTone(stage.status)}>
                {getStageStatusLabel(stage.status)}
              </StatusPill>
              <StatusPill tone="info">
                {getRuleSummaryLabel(stage.advancementRule)}
              </StatusPill>
            </>
          ) : null}
        </div>

        <DetailList>
          <DetailListItem
            label="赛制"
            value={stage ? getTournamentFormatLabel(stage.format) : '--'}
          />
          <DetailListItem
            label="晋级规则"
            value={describeAdvancementRule(stage)}
          />
          <DetailListItem label="规则细节" value={details.join(' / ')} />
        </DetailList>
      </div>
    </DetailCard>
  );
}
