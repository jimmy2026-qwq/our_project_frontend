import { SeatWind } from '@/objects/tournament';

import type { PaifuRound as PaifuRoundSummary } from '@/objects';
import type { TablePaifuDetail } from '../../../../objects/TablePaifuDetail';
import { replaySeatOrder as seatOrder } from '../../../../objects/replaySeatInfo';
import { CenterPoint } from './CenterPoint';
import { CenterTableInfo } from './CenterTableInfo';
import type { CenterScoreDisplay } from '@/pages/TablePaifuPage/components/PaifuHandTable/objects/CenterScoreDisplay';
import type { TableStickDisplay } from '@/pages/TablePaifuPage/components/PaifuHandTable/objects/TableStickDisplay';
export { RoundPicker } from './RoundPicker';

interface CenterTableProps {
  isExhaustiveDrawResult: boolean;
  isRelativeScoreMode: boolean;
  isRoundPickerOpen: boolean;
  onToggleRelativeScoreMode: () => void;
  onToggleRoundPicker: () => void;
  paifu: TablePaifuDetail;
  replayStep: number;
  round: PaifuRoundSummary;
  scoreDisplays: Record<SeatWind, CenterScoreDisplay>;
  tableSticks: TableStickDisplay;
}

/** 牌谱回放桌面中央的状态信息与轮次导航。 */
export function CenterTable({
  isExhaustiveDrawResult,
  isRelativeScoreMode,
  isRoundPickerOpen,
  onToggleRelativeScoreMode,
  onToggleRoundPicker,
  paifu,
  replayStep,
  round,
  scoreDisplays,
  tableSticks,
}: CenterTableProps) {
  const referencePoints = scoreDisplays[SeatWind.East]?.points;

  return (
    <div className="absolute left-1/2 top-1/2 z-[8] grid h-[260px] w-[420px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[24px] border border-[rgba(236,197,122,0.34)] bg-[rgba(6,17,26,0.78)] text-center shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-[10px]">
      {seatOrder.map((seat) => (
        <CenterPoint
          key={`${seat}-center-point`}
          isRelativeScoreMode={isRelativeScoreMode}
          onToggleRelativeScoreMode={
            seat === SeatWind.East ? onToggleRelativeScoreMode : undefined
          }
          paifu={paifu}
          referencePoints={referencePoints}
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
