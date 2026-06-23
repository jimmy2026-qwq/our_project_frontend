import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogSurface, DialogTitle, FieldGroup, TextInputField } from '@/components/ui';
import { MahjongGameLengths, normalizeMahjongRuleset, TournamentFormat, type MahjongGameLength } from '@/objects/tournament';

import { getStageAdvanceCount } from '../../../../functions/getTournamentDetailRules';
import { useTournamentDetailRulesPanel } from './hooks/useTournamentDetailRulesPanel';
import { ReadonlyRuleCheckbox } from './ReadonlyRuleCheckbox';
import { describeKnockoutSeeding, describeSwissPairing } from './functions/getRuleDetailsDialogLabels';

const gameLengthOptions: Array<{ value: MahjongGameLength; label: string }> = [
  { value: MahjongGameLengths.OneKyoku, label: '一局战' },
  { value: MahjongGameLengths.Tonpu, label: '东风战' },
  { value: MahjongGameLengths.Hanchan, label: '半庄战' },
];

/** 展开查看完整赛事规则配置的详情弹窗。 */
export function RuleDetailsDialog({
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
  const format = stage?.format ?? TournamentFormat.Swiss;

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
                      { value: TournamentFormat.Swiss, label: '瑞士轮' },
                      { value: TournamentFormat.Knockout, label: '淘汰赛' },
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
                    label={
                      format === TournamentFormat.Knockout
                        ? '入围人数'
                        : '晋级人数'
                    }
                    value={getStageAdvanceCount(stage)}
                    readOnly
                  />
                  <TextInputField label="轮数" value={stage.roundCount ?? '--'} readOnly />
                  <TextInputField
                    label="排桌池"
                    value={stage.schedulingPoolSize ?? '--'}
                    readOnly
                  />
                  <TextInputField
                    label={
                      format === TournamentFormat.Knockout ? '种子' : '配桌'
                    }
                    value={
                      format === TournamentFormat.Knockout
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
                    <TextInputField label="初始点数" value={ruleset.initialPoints} readOnly />
                    <TextInputField label="一位必要点数" value={ruleset.targetPoints} readOnly />
                    <TextInputField
                      label="赤宝牌数量"
                      value={ruleset.akaDora ? ruleset.akaDoraCount : 0}
                      readOnly
                    />
                    <TextInputField label="番缚" value={`${ruleset.minHan} 番`} readOnly />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <ReadonlyRuleCheckbox label="赤宝牌" checked={ruleset.akaDora} />
                    <ReadonlyRuleCheckbox label="食断" checked={ruleset.openTanyao} />
                    <ReadonlyRuleCheckbox label="双响" checked={ruleset.doubleRon} />
                    <ReadonlyRuleCheckbox
                      label="三家和流局"
                      checked={ruleset.tripleRonAbortiveDraw}
                    />
                    <ReadonlyRuleCheckbox label="流局满贯" checked={ruleset.nagashiMangan} />
                    <ReadonlyRuleCheckbox
                      label="多倍役满"
                      checked={ruleset.allowMultipleYakuman}
                    />
                    <ReadonlyRuleCheckbox label="击飞" checked={ruleset.bankruptcyEnd} />
                    <ReadonlyRuleCheckbox
                      label="All last 庄家一位即止"
                      checked={ruleset.allLastDealerFinishAsTop}
                    />
                    {format === TournamentFormat.Swiss ? (
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
