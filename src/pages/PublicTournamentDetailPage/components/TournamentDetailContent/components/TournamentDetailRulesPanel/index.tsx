import { useState } from 'react';

import {
  Button,
  DetailCard,
  DetailList,
  DetailListItem,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  FieldGroup,
  StatusPill,
  TextInputField,
} from '@/components/ui';
import {
  normalizeMahjongRuleset,
  type KnockoutRuleConfig,
  type MahjongGameLength,
  type SwissRuleConfig,
} from '@/objects/tournament';

import type { TournamentDetailWorkbenchState } from '../../../../objects/TournamentDetail.types';
import {
  describeAdvancementRule,
  getRuleSummaryLabel,
  getStageAdvanceCount,
  getTournamentFormatLabel,
} from '../../../../functions/getTournamentDetailRules';
import { getStageStatusLabel } from '../../../../functions/getTournamentDetailLabels';
import { getStatusTone } from '../../../../functions/getTournamentDetailStatus';
import { useTournamentDetailRulesPanel } from './hooks/useTournamentDetailRulesPanel';

type TournamentResultRow = ReturnType<
  typeof useTournamentDetailRulesPanel
>['playerDisplayRows'][number];

const gameLengthOptions: Array<{ value: MahjongGameLength; label: string }> = [
  { value: 'OneKyoku', label: '一局战' },
  { value: 'Tonpu', label: '东风战' },
  { value: 'Hanchan', label: '半庄战' },
];

export function TournamentCurrentRulesPanel({
  workbench,
  onOpenRulesDialog,
}: {
  workbench: TournamentDetailWorkbenchState;
  onOpenRulesDialog: () => void;
}) {
  const rulesPanel = useTournamentDetailRulesPanel(workbench);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isRuleDetailsDialogOpen, setIsRuleDetailsDialogOpen] =
    useState(false);

  return (
    <>
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
                rulesPanel.showTournamentResults ? (
                  <Button onClick={() => setIsResultDialogOpen(true)}>
                    查看结果
                  </Button>
                ) : rulesPanel.playerDisplayRows.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {rulesPanel.playerDisplayRows.map((row, index) => (
                      <span
                        key={`${row.playerId}-${index}`}
                        className="inline-flex min-h-8 items-center border border-[rgba(219,175,98,0.28)] bg-[rgba(28,40,74,0.72)] px-3 text-sm text-[#f2f7fb]"
                      >
                        {row.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  '暂无晋级名单'
                )
              }
            />
            <DetailListItem
              label="规则细节"
              value={
                <Button onClick={() => setIsRuleDetailsDialogOpen(true)}>
                  查看规则细节
                </Button>
              }
            />
          </DetailList>
        </div>
      </DetailCard>

      <TournamentResultDialog
        open={isResultDialogOpen}
        rows={rulesPanel.playerDisplayRows}
        currentPlayerId={workbench.operatorId}
        onOpenChange={setIsResultDialogOpen}
      />
      <RuleDetailsDialog
        open={isRuleDetailsDialogOpen}
        stage={rulesPanel.stage}
        details={rulesPanel.details}
        onOpenChange={setIsRuleDetailsDialogOpen}
      />
    </>
  );
}

function RuleDetailsDialog({
  open,
  stage,
  details,
  onOpenChange,
}: {
  open: boolean;
  stage: ReturnType<typeof useTournamentDetailRulesPanel>['stage'];
  details: string[];
  onOpenChange: (open: boolean) => void;
}) {
  const ruleset = normalizeMahjongRuleset(stage?.mahjongRuleset);
  const format = stage?.format ?? 'Swiss';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface className="text-[#f2f7fb] [&_input[readonly]]:!border-[rgba(176,223,229,0.18)] [&_input[readonly]]:!bg-[rgba(5,14,23,0.72)] [&_input[readonly]]:!text-[#f2f7fb] [&_input[readonly]]:opacity-100 [&_option]:bg-[rgba(8,18,29,0.98)] [&_option]:text-[#f2f7fb] [&_[data-slot=dialog-title]]:text-[#f2f7fb] [&_[data-slot=input]]:text-[#f2f7fb] [&_[data-slot=select]]:text-[#f2f7fb] [&_label>span]:!text-[#f2f7fb]">
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>规则细节</DialogTitle>
          </DialogHeader>
          <DialogBody className="max-h-[70vh] overflow-y-auto px-6 py-5">
            {stage ? (
              <FieldGroup className="gap-5">
                <div className="grid gap-2">
                  <span className="leading-7 text-[#f2f7fb]">赛制</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'Swiss', label: '瑞士轮' },
                      { value: 'Knockout', label: '淘汰赛' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={[
                          'min-h-10 cursor-not-allowed border px-3 text-sm font-semibold transition-colors',
                          format === option.value
                            ? 'border-[#ecc57a] bg-[rgba(236,197,122,0.24)] text-[#fff7df]'
                            : 'border-[rgba(176,223,229,0.16)] bg-[rgba(5,14,23,0.7)] text-[#f2f7fb]',
                        ].join(' ')}
                        disabled
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <TextInputField
                    label={format === 'Knockout' ? '入围人数' : '晋级人数'}
                    value={getStageAdvanceCount(stage)}
                    readOnly
                  />
                  <TextInputField
                    label="轮数"
                    value={stage.roundCount ?? '--'}
                    readOnly
                  />
                  <TextInputField
                    label="排桌池"
                    value={stage.schedulingPoolSize ?? '--'}
                    readOnly
                  />
                  <TextInputField
                    label={format === 'Knockout' ? '种子' : '配桌'}
                    value={
                      format === 'Knockout'
                        ? describeKnockoutSeeding(stage.knockoutRule)
                        : describeSwissPairing(stage.swissRule)
                    }
                    readOnly
                  />
                </div>

                <section className="grid gap-4 border-t border-[rgba(176,223,229,0.12)] pt-5">
                  <div className="grid gap-2">
                    <span className="leading-7 text-[#9ab0c1]">牌局长度</span>
                    <div className="grid grid-cols-3 gap-2">
                      {gameLengthOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={[
                            'min-h-10 cursor-not-allowed border px-3 text-sm font-medium transition-colors',
                            ruleset.gameLength === option.value
                              ? 'border-[#ecc57a] bg-[rgba(236,197,122,0.24)] text-[#fff7df]'
                              : 'border-[rgba(176,223,229,0.16)] bg-[rgba(5,14,23,0.7)] text-[#c8d8e5]',
                          ].join(' ')}
                          disabled
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <TextInputField
                    label="初始点数"
                    value={ruleset.initialPoints}
                    readOnly
                  />
                  <TextInputField
                    label="一位必要点数"
                    value={ruleset.targetPoints}
                    readOnly
                  />
                  <TextInputField
                    label="赤宝牌数量"
                    value={ruleset.akaDora ? ruleset.akaDoraCount : 0}
                    readOnly
                  />
                  <TextInputField
                    label="番缚"
                    value={`${ruleset.minHan} 番`}
                    readOnly
                  />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <ReadonlyRuleCheckbox label="赤宝牌" checked={ruleset.akaDora} />
                    <ReadonlyRuleCheckbox label="食断" checked={ruleset.openTanyao} />
                    <ReadonlyRuleCheckbox label="双响" checked={ruleset.doubleRon} />
                    <ReadonlyRuleCheckbox
                      label="三家和流局"
                      checked={ruleset.tripleRonAbortiveDraw}
                    />
                    <ReadonlyRuleCheckbox
                      label="流局满贯"
                      checked={ruleset.nagashiMangan}
                    />
                    <ReadonlyRuleCheckbox
                      label="多倍役满"
                      checked={ruleset.allowMultipleYakuman}
                    />
                    <ReadonlyRuleCheckbox label="击飞" checked={ruleset.bankruptcyEnd} />
                    <ReadonlyRuleCheckbox
                      label="All last 庄家一位即止"
                      checked={ruleset.allLastDealerFinishAsTop}
                    />
                    {format === 'Swiss' ? (
                      <ReadonlyRuleCheckbox
                        label="积分带入"
                        checked={stage.swissRule?.carryOverPoints !== false}
                      />
                    ) : (
                      <ReadonlyRuleCheckbox
                        label="季军赛"
                        checked={stage.knockoutRule?.thirdPlaceMatch === true}
                      />
                    )}
                  </div>
                </section>
              </FieldGroup>
            ) : (
              <p className="m-0 leading-7 text-[#9ab0c1]">
                {details.join(' / ')}
              </p>
            )}
          </DialogBody>
          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <Button onClick={() => onOpenChange(false)}>关闭</Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}

function TournamentResultDialog({
  open,
  rows,
  currentPlayerId,
  onOpenChange,
}: {
  open: boolean;
  rows: TournamentResultRow[];
  currentPlayerId?: string;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface className="w-[min(520px,calc(100%-40px))] text-[#f2f7fb]">
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle className="text-[#f2f7fb]">赛事结果</DialogTitle>
          </DialogHeader>
          <DialogBody className="px-6 py-5 text-[#f2f7fb]">
            {rows.length > 0 ? (
              <div className="grid max-h-[24rem] gap-2 overflow-y-auto pr-1 [scrollbar-color:rgba(176,223,229,0.34)_rgba(255,255,255,0.06)] [scrollbar-width:thin]">
                {rows.map((row, index) => (
                  <div
                    key={`${row.playerId}-${index}`}
                    className="grid grid-cols-[minmax(7rem,auto)_minmax(0,1fr)] items-center gap-3 border-b border-[rgba(255,255,255,0.14)] py-3 text-base leading-6"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <strong
                        className={`rounded-lg border px-2 py-1 ${getPlacementClassName(
                          row.placement,
                        )}`}
                      >
                        {row.placement ? `${row.placement}位` : '--'}
                      </strong>
                      {currentPlayerId && row.playerId === currentPlayerId ? (
                        <StatusPill tone="success" className="px-2 py-0.5">
                          我
                        </StatusPill>
                      ) : null}
                    </span>
                    <span className="min-w-0 truncate text-right text-[#c7d6e2]">
                      {row.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="m-0 text-[#9ab0c1]">暂无赛事结果</p>
            )}
          </DialogBody>
          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <Button onClick={() => onOpenChange(false)}>关闭</Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}

function getPlacementClassName(placement?: number) {
  const classNames: Record<number, string> = {
    1: 'border-[rgba(255,215,0,0.42)] bg-[rgba(255,215,0,0.16)] text-[#ffd700]',
    2: 'border-[rgba(192,192,192,0.42)] bg-[rgba(192,192,192,0.14)] text-[#c0c0c0]',
    3: 'border-[rgba(205,127,50,0.44)] bg-[rgba(205,127,50,0.15)] text-[#cd7f32]',
    4: 'border-[rgba(87,227,141,0.40)] bg-[rgba(87,227,141,0.13)] text-[#57e38d]',
  };
  const defaultClassName =
    'border-[rgba(242,247,251,0.24)] bg-[rgba(242,247,251,0.08)] text-[#f2f7fb]';

  return `whitespace-nowrap font-bold ${
    typeof placement === 'number'
      ? (classNames[placement] ?? defaultClassName)
      : defaultClassName
  }`;
}

function ReadonlyRuleCheckbox({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  return (
    <div className="inline-flex min-h-9 items-center justify-start gap-2">
      <span
        aria-hidden="true"
        className={[
          'grid size-5 place-items-center border text-[0.9rem] font-black leading-none',
          checked
            ? 'border-[rgba(87,227,141,0.72)] bg-[rgba(87,227,141,0.24)] text-[#57e38d] shadow-[0_0_16px_rgba(87,227,141,0.18)]'
            : 'border-[rgba(154,176,193,0.32)] bg-[rgba(255,255,255,0.035)] text-transparent',
        ].join(' ')}
      >
        ✓
      </span>
      <span className="text-[#f2f7fb]">{label}</span>
    </div>
  );
}

function describeSwissPairing(rule?: SwissRuleConfig | null) {
  return rule?.pairingMethod === 'snake' ? '蛇形分组' : '均衡 ELO';
}

function describeKnockoutSeeding(rule?: KnockoutRuleConfig | null) {
  switch (rule?.seedingPolicy) {
    case 'standings':
      return '按当前排名';
    case 'ranking':
      return '按段位';
    case 'elo':
    case 'rating':
    default:
      return '按 ELO';
  }
}
