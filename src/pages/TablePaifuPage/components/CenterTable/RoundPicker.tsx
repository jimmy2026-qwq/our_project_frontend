import type { PaifuRoundSummary } from '../../types';
import { getRoundTitle } from '../../objects/replay';

interface RoundPickerProps {
  onSelectRound: (index: number) => void;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
}

export function RoundPicker({
  onSelectRound,
  rounds,
  selectedRoundIndex,
}: RoundPickerProps) {
  return (
    <div className="absolute left-[calc(50%+240px)] top-1/2 z-[9] grid min-w-[180px] -translate-y-1/2 justify-items-stretch gap-2 rounded-[20px] border border-[rgba(236,197,122,0.3)] bg-[rgba(6,17,26,0.9)] p-3 text-center shadow-[0_18px_48px_rgba(0,0,0,0.36)] backdrop-blur-[12px]">
      {rounds.map((item, index) => (
        <button
          key={`${item.descriptor.roundWind}-${item.descriptor.handNumber}-${item.descriptor.honba}-${index}`}
          className={[
            'w-full rounded-2xl border px-4 py-2 text-center text-sm transition-[border-color,background-color,color] duration-200',
            selectedRoundIndex === index
              ? 'border-[rgba(236,197,122,0.5)] bg-[rgba(236,197,122,0.18)] text-[#ffd98a]'
              : 'border-[rgba(176,223,229,0.14)] bg-[rgba(255,255,255,0.03)] text-[#c7d6e2] hover:border-[rgba(114,216,209,0.32)] hover:text-[#f2f7fb]',
          ].join(' ')}
          onClick={() => onSelectRound(index)}
          type="button"
        >
          {getRoundTitle(item)}
        </button>
      ))}
    </div>
  );
}
