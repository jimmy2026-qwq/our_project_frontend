import { TextInputField } from '@/components/ui';
import type { MahjongRuleset } from '@/objects/tournament';

import { TournamentGameLengthOptions } from './TournamentGameLengthOptions';
import { TournamentRulesetBooleanFields } from './TournamentRulesetBooleanFields';

/** 赛事规则弹窗中编辑麻将规则数值字段的表单区域。 */
export function TournamentMahjongRulesetFields({
  disabled,
  ruleset,
  onRulesetChange,
}: {
  disabled: boolean;
  ruleset: MahjongRuleset;
  onRulesetChange: (patch: Partial<MahjongRuleset>) => void;
}) {
  return (
    <section className="grid gap-4 border-t border-[rgba(176,223,229,0.12)] pt-5">
      <TournamentGameLengthOptions
        disabled={disabled}
        ruleset={ruleset}
        onRulesetChange={onRulesetChange}
      />

      <div className="grid gap-3 md:grid-cols-2">
        <TextInputField
          label="初始点数"
          type="number"
          min={1}
          step={100}
          value={ruleset.initialPoints}
          onChange={(event) =>
            onRulesetChange({
              initialPoints: Number(event.currentTarget.value),
            })
          }
          disabled={disabled}
        />
        <TextInputField
          label="一位必要点数"
          type="number"
          min={1}
          step={100}
          value={ruleset.targetPoints}
          onChange={(event) =>
            onRulesetChange({
              targetPoints: Number(event.currentTarget.value),
            })
          }
          disabled={disabled}
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

            onRulesetChange({
              akaDora: akaDoraCount > 0,
              akaDoraCount,
            });
          }}
          disabled={disabled || !ruleset.akaDora}
        />
        <TextInputField
          label="番缚"
          type="number"
          min={1}
          step={1}
          value={ruleset.minHan}
          onChange={(event) =>
            onRulesetChange({ minHan: Number(event.currentTarget.value) })
          }
          disabled={disabled}
        />
      </div>

      <TournamentRulesetBooleanFields
        disabled={disabled}
        ruleset={ruleset}
        onRulesetChange={onRulesetChange}
      />
    </section>
  );
}
