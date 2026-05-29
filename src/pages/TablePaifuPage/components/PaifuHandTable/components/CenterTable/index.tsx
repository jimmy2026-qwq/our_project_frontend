import type { SeatWind } from '@/objects/tournament';

import type { PaifuRoundSummary, TablePaifuDetail } from '../../../../types';
import { seatOrder } from '../../../../functions/getReplay';
import { CenterPoint } from './CenterPoint';
import { CenterTableInfo } from './CenterTableInfo';
import type {
  CenterScoreDisplay,
  TableStickDisplay,
} from './CenterTable.types';

export type {
  CenterScoreDisplay,
  TableStickDisplay,
} from './CenterTable.types';
export { RoundPicker } from './RoundPicker';

interface CenterTableProps {
  isExhaustiveDrawResult: boolean;
  isRoundPickerOpen: boolean;
  onToggleRoundPicker: () => void;
  paifu: TablePaifuDetail;
  replayStep: number;
  round: PaifuRoundSummary;
  scoreDisplays: Record<SeatWind, CenterScoreDisplay>;
  tableSticks: TableStickDisplay;
}

export function CenterTable({
  isExhaustiveDrawResult,
  isRoundPickerOpen,
  onToggleRoundPicker,
  paifu,
  replayStep,
  round,
  scoreDisplays,
  tableSticks,
}: CenterTableProps) {
  return (
    <div className="absolute left-1/2 top-1/2 z-[8] grid h-[260px] w-[420px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[24px] border border-[rgba(236,197,122,0.34)] bg-[rgba(6,17,26,0.78)] text-center shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-[10px]">
      {seatOrder.map((seat) => (
        <CenterPoint
          key={`${seat}-center-point`}
          paifu={paifu}
          scoreDisplay={scoreDisplays[seat]}
          seat={seat}
        />
      ))}
      <CenterTableInfo
        isExhaustiveDrawResult={isExhaustiveDrawResult}
        isRoundPickerOpen={isRoundPickerOpen}
        onToggleRoundPicker={onToggleRoundPicker}
        replayStep={replayStep}
        round={round}
        tableSticks={tableSticks}
      />
    </div>
  );
}
