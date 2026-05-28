import { Button, DetailCard, DetailList, DetailListItem, StatusPill } from '@/components/ui';
import type { TournamentDetailWorkbenchState } from '../../../../objects/TournamentDetail.types';
import {
  describeAdvancementRule,
  getRuleSummaryLabel,
  getTournamentFormatLabel,
} from '../../../../objects/TournamentDetail.rules';
import { getStageStatusLabel } from '../../../../functions/getTournamentDetailLabels';
import { getStatusTone } from '../../../../functions/getTournamentDetailStatus';
import { useTournamentDetailRulesPanel } from './hooks/useTournamentDetailRulesPanel';

export function TournamentCurrentRulesPanel({
  workbench,
  onOpenRulesDialog,
}: {
  workbench: TournamentDetailWorkbenchState;
  onOpenRulesDialog: () => void;
}) {
  const rulesPanel = useTournamentDetailRulesPanel(workbench);

  return (
    <DetailCard
      title={
        <span className="flex flex-wrap items-center gap-3 text-[1.25rem] font-semibold">
          <span>当前阶段规则</span>
          {rulesPanel.canEditRules ? (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenRulesDialog}
              disabled={workbench.isSubmittingTournamentAction}
            >
              {rulesPanel.actionLabel}
            </Button>
          ) : null}
        </span>
      }
    >
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <strong className="text-[#f2f7fb]">
            {rulesPanel.stage?.name ?? '尚未创建赛段'}
          </strong>
          {rulesPanel.stage ? (
            <>
              <StatusPill tone={getStatusTone(rulesPanel.stage.status)}>
                {getStageStatusLabel(rulesPanel.stage.status)}
              </StatusPill>
              <StatusPill tone="info">
                {getRuleSummaryLabel(rulesPanel.stage.advancementRule)}
              </StatusPill>
            </>
          ) : null}
        </div>

        <DetailList>
          <DetailListItem
            label="赛制"
            value={
              rulesPanel.stage
                ? getTournamentFormatLabel(rulesPanel.stage.format)
                : '--'
            }
          />
          <DetailListItem
            label="晋级规则"
            value={describeAdvancementRule(rulesPanel.stage)}
          />
          <DetailListItem
            label={rulesPanel.showTournamentResults ? '赛事结果' : '晋级名单'}
            value={
              rulesPanel.playerDisplayRows.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {rulesPanel.playerDisplayRows.map((row, index) => (
                    <span
                      key={`${row.playerId}-${index}`}
                      className="inline-flex min-h-8 items-center border border-[rgba(219,175,98,0.28)] bg-[rgba(28,40,74,0.72)] px-3 text-sm text-[#f2f7fb]"
                    >
                      {rulesPanel.showTournamentResults && row.placement
                        ? `第 ${row.placement} 名 ${row.name}`
                        : row.name}
                    </span>
                  ))}
                </div>
              ) : (
                rulesPanel.showTournamentResults ? '暂无赛事结果' : '暂无晋级名单'
              )
            }
          />
          <DetailListItem
            label="规则细节"
            value={rulesPanel.details.join(' / ')}
          />
        </DetailList>
      </div>
    </DetailCard>
  );
}
