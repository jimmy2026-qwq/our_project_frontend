import { CheckboxField } from '@/components/ui';
import type { MahjongRuleset } from '@/objects/tournament';

export function TournamentRulesetBooleanFields({
  disabled,
  ruleset,
  onRulesetChange,
}: {
  disabled: boolean;
  ruleset: MahjongRuleset;
  onRulesetChange: (patch: Partial<MahjongRuleset>) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <CheckboxField
        label="赤宝牌"
        checked={ruleset.akaDora}
        onChange={(event) =>
          onRulesetChange({
            akaDora: event.currentTarget.checked,
            akaDoraCount: event.currentTarget.checked
              ? Math.max(1, ruleset.akaDoraCount || 3)
              : 0,
          })
        }
        disabled={disabled}
      />
      <CheckboxField
        label="食断"
        checked={ruleset.openTanyao}
        onChange={(event) =>
          onRulesetChange({ openTanyao: event.currentTarget.checked })
        }
        disabled={disabled}
      />
      <CheckboxField
        label="双响"
        checked={ruleset.doubleRon}
        onChange={(event) =>
          onRulesetChange({ doubleRon: event.currentTarget.checked })
        }
        disabled={disabled}
      />
      <CheckboxField
        label="三家和流局"
        checked={ruleset.tripleRonAbortiveDraw}
        onChange={(event) =>
          onRulesetChange({
            tripleRonAbortiveDraw: event.currentTarget.checked,
          })
        }
        disabled={disabled}
      />
      <CheckboxField
        label="流局满贯"
        checked={ruleset.nagashiMangan}
        onChange={(event) =>
          onRulesetChange({ nagashiMangan: event.currentTarget.checked })
        }
        disabled={disabled}
      />
      <CheckboxField
        label="多倍役满"
        checked={ruleset.allowMultipleYakuman}
        onChange={(event) =>
          onRulesetChange({
            allowMultipleYakuman: event.currentTarget.checked,
          })
        }
        disabled={disabled}
      />
      <CheckboxField
        label="击飞"
        checked={ruleset.bankruptcyEnd}
        onChange={(event) =>
          onRulesetChange({ bankruptcyEnd: event.currentTarget.checked })
        }
        disabled={disabled}
      />
      <CheckboxField
        label="All last 庄家一位即止"
        checked={ruleset.allLastDealerFinishAsTop}
        onChange={(event) =>
          onRulesetChange({
            allLastDealerFinishAsTop: event.currentTarget.checked,
          })
        }
        disabled={disabled}
      />
    </div>
  );
}
