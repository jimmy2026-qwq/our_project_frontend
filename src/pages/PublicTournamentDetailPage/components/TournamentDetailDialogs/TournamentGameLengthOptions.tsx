import type {
  MahjongGameLength,
  MahjongRuleset,
} from '@/objects/tournament';

const gameLengthOptions: Array<{ value: MahjongGameLength; label: string }> = [
  { value: 'OneKyoku', label: '一局战' },
  { value: 'Tonpu', label: '东风战' },
  { value: 'Hanchan', label: '半庄战' },
];

export function TournamentGameLengthOptions({
  disabled,
  ruleset,
  onRulesetChange,
}: {
  disabled: boolean;
  ruleset: MahjongRuleset;
  onRulesetChange: (patch: Partial<MahjongRuleset>) => void;
}) {
  return (
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
              disabled
                ? 'cursor-not-allowed opacity-55'
                : 'hover:border-[rgba(236,197,122,0.52)]',
            ].join(' ')}
            onClick={() => onRulesetChange({ gameLength: option.value })}
            disabled={disabled}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
