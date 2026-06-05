import {
  Button,
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  FieldGroup,
  CheckboxField,
  SelectField,
  TextInputField,
} from '@/components/ui';
import type {
  MahjongGameLength,
  MahjongRuleset,
  TournamentFormat,
} from '@/objects/tournament';
import { normalizeMahjongRuleset } from '@/objects/tournament';
import type { TournamentStageRuleDraft } from '../../objects/TournamentDetailRule.types';

const gameLengthOptions: Array<{ value: MahjongGameLength; label: string }> = [
  { value: 'OneKyoku', label: '一局战' },
  { value: 'Tonpu', label: '东风战' },
  { value: 'Hanchan', label: '半庄战' },
];

export function TournamentRulesDialog({
  open,
  draft,
  isSubmitting,
  hasStage,
  onOpenChange,
  onDraftChange,
  onSubmit,
}: {
  open: boolean;
  draft: TournamentStageRuleDraft;
  isSubmitting: boolean;
  hasStage: boolean;
  onOpenChange: (open: boolean) => void;
  onDraftChange: (draft: TournamentStageRuleDraft) => void;
  onSubmit: () => void;
}) {
  const ruleset = draft.mahjongRuleset;

  function updateRuleset(patch: Partial<MahjongRuleset>) {
    onDraftChange({
      ...draft,
      mahjongRuleset: normalizeMahjongRuleset({
        ...ruleset,
        ...patch,
      }),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface className="text-[#f2f7fb] [&_option]:bg-[rgba(8,18,29,0.98)] [&_option]:text-[#f2f7fb] [&_[data-slot=dialog-title]]:text-[#f2f7fb] [&_[data-slot=input]]:text-[#f2f7fb] [&_[data-slot=select]]:text-[#f2f7fb]">
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>
              {hasStage ? '修改当前阶段规则' : '创建当前阶段规则'}
            </DialogTitle>
            <DialogDescription>
              设置赛段晋级方式和牌桌规则。
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            <FieldGroup className="gap-5">
              <SelectField
                label="赛制"
                value={draft.format}
                onChange={(event) =>
                  onDraftChange({
                    ...draft,
                    format: event.currentTarget.value as TournamentFormat,
                  })
                }
                disabled={isSubmitting}
              >
                <option value="Swiss">瑞士轮</option>
                <option value="Knockout">淘汰赛</option>
              </SelectField>
              <TextInputField
                label={draft.format === 'Knockout' ? '入围人数' : '晋级人数'}
                type="number"
                min={1}
                step={1}
                value={draft.advanceCount}
                onChange={(event) =>
                  onDraftChange({
                    ...draft,
                    advanceCount: Number(event.currentTarget.value),
                  })
                }
                disabled={isSubmitting}
              />

              <section className="grid gap-4 border-t border-[rgba(176,223,229,0.12)] pt-5">
                <div className="grid gap-2">
                  <span className="leading-7 text-[#9ab0c1]">牌局长度</span>
                  <div className="grid grid-cols-3 gap-2">
                    {gameLengthOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={[
                          'min-h-10 border px-3 text-sm font-medium transition-colors',
                          ruleset.gameLength === option.value
                            ? 'border-[#ecc57a] bg-[rgba(236,197,122,0.24)] text-[#fff7df]'
                            : 'border-[rgba(176,223,229,0.16)] bg-[rgba(5,14,23,0.7)] text-[#c8d8e5]',
                          isSubmitting
                            ? 'cursor-not-allowed opacity-55'
                            : 'hover:border-[rgba(236,197,122,0.52)]',
                        ].join(' ')}
                        onClick={() =>
                          updateRuleset({ gameLength: option.value })
                        }
                        disabled={isSubmitting}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <TextInputField
                    label="初始点数"
                    type="number"
                    min={1}
                    step={100}
                    value={ruleset.initialPoints}
                    onChange={(event) =>
                      updateRuleset({
                        initialPoints: Number(event.currentTarget.value),
                      })
                    }
                    disabled={isSubmitting}
                  />
                  <TextInputField
                    label="返还点/目标点"
                    type="number"
                    min={1}
                    step={100}
                    value={ruleset.targetPoints}
                    onChange={(event) =>
                      updateRuleset({
                        targetPoints: Number(event.currentTarget.value),
                      })
                    }
                    disabled={isSubmitting}
                  />
                  <TextInputField
                    label="赤宝牌数量"
                    type="number"
                    min={0}
                    max={3}
                    step={1}
                    value={ruleset.akaDoraCount}
                    onChange={(event) => {
                      const akaDoraCount = Number(event.currentTarget.value);
                      updateRuleset({
                        akaDora: akaDoraCount > 0,
                        akaDoraCount,
                      });
                    }}
                    disabled={isSubmitting || !ruleset.akaDora}
                  />
                  <TextInputField
                    label="番缚"
                    type="number"
                    min={1}
                    step={1}
                    value={ruleset.minHan}
                    onChange={(event) =>
                      updateRuleset({ minHan: Number(event.currentTarget.value) })
                    }
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <CheckboxField
                    label="赤宝牌"
                    checked={ruleset.akaDora}
                    onChange={(event) =>
                      updateRuleset({
                        akaDora: event.currentTarget.checked,
                        akaDoraCount: event.currentTarget.checked
                          ? Math.max(1, ruleset.akaDoraCount || 3)
                          : 0,
                      })
                    }
                    disabled={isSubmitting}
                  />
                  <CheckboxField
                    label="食断"
                    checked={ruleset.openTanyao}
                    onChange={(event) =>
                      updateRuleset({ openTanyao: event.currentTarget.checked })
                    }
                    disabled={isSubmitting}
                  />
                  <CheckboxField
                    label="双响"
                    checked={ruleset.doubleRon}
                    onChange={(event) =>
                      updateRuleset({ doubleRon: event.currentTarget.checked })
                    }
                    disabled={isSubmitting}
                  />
                  <CheckboxField
                    label="三家和流局"
                    checked={ruleset.tripleRonAbortiveDraw}
                    onChange={(event) =>
                      updateRuleset({
                        tripleRonAbortiveDraw: event.currentTarget.checked,
                      })
                    }
                    disabled={isSubmitting}
                  />
                  <CheckboxField
                    label="流局满贯"
                    checked={ruleset.nagashiMangan}
                    onChange={(event) =>
                      updateRuleset({ nagashiMangan: event.currentTarget.checked })
                    }
                    disabled={isSubmitting}
                  />
                  <CheckboxField
                    label="多倍役满"
                    checked={ruleset.allowMultipleYakuman}
                    onChange={(event) =>
                      updateRuleset({
                        allowMultipleYakuman: event.currentTarget.checked,
                      })
                    }
                    disabled={isSubmitting}
                  />
                  <CheckboxField
                    label="击飞"
                    checked={ruleset.bankruptcyEnd}
                    onChange={(event) =>
                      updateRuleset({ bankruptcyEnd: event.currentTarget.checked })
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </section>
            </FieldGroup>
          </DialogBody>

          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isSubmitting || draft.advanceCount < 1}
            >
              {isSubmitting ? '保存中...' : '保存规则'}
            </Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
