import {
  getPaifuTileCode,
  type MahjongSeatView,
  type MahjongTableView,
  type SeatWind,
} from '@/objects';
import {
  BangziCounter,
  RemainingTileCount,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/components/CenterTable/CenterTableCounters';
import type { CenterScoreDisplay } from '@/pages/TablePaifuPage/components/PaifuHandTable/objects/CenterTableDisplay';
import { DoraIndicatorTile } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';

import { MatchCenterPoint, getCenterPointPoints } from './MatchCenterPoint';
import { getRoundLabel } from '../../functions/getMatchBoardLabels';

const seatOrder: SeatWind[] = ['East', 'South', 'West', 'North'];

interface MatchCenterTableProps {
  isRelativeScoreMode?: boolean;
  mahjongTable: MahjongTableView;
  onToggleRelativeScoreMode?: () => void;
  scoreDisplays?: Record<SeatWind, CenterScoreDisplay>;
  seatsByDisplaySeat: Record<SeatWind, MahjongSeatView | null>;
}

export function MatchCenterTable({
  isRelativeScoreMode = false,
  mahjongTable,
  onToggleRelativeScoreMode,
  scoreDisplays,
  seatsByDisplaySeat,
}: MatchCenterTableProps) {
  const round = mahjongTable.currentRound;
  const doraIndicators =
    round?.doraIndicators.slice(0, round.doraIndicatorVisibleCount) ?? [];
  const referencePoints = getCenterPointPoints(
    scoreDisplays?.East,
    seatsByDisplaySeat.East,
  );

  return (
    <div className="absolute left-1/2 top-1/2 z-[10] grid h-[260px] w-[min(88vw,420px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[24px] border border-[rgba(236,197,122,0.34)] bg-[rgba(6,17,26,0.78)] text-center shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-[10px]">
      {seatOrder.map((seat) => (
        <MatchCenterPoint
          key={`${seat}-center-point`}
          isRelativeScoreMode={isRelativeScoreMode}
          onToggleRelativeScoreMode={
            seat === 'East' ? onToggleRelativeScoreMode : undefined
          }
          referencePoints={referencePoints}
          scoreDisplay={scoreDisplays?.[seat]}
          seat={seat}
          seatView={seatsByDisplaySeat[seat]}
        />
      ))}

      <div className="relative z-[2] grid justify-items-center gap-3">
        <div className="rounded-xl px-2 py-1 text-[0.76rem] font-semibold tracking-[0.16em] text-[#ecc57a]">
          {round ? getRoundLabel(round.descriptor) : '未开局'}
        </div>

        <div className="grid justify-items-center gap-1">
          <span className="text-[0.66rem] font-semibold tracking-[0.18em] text-[#9ab0c1]">
            宝牌指示牌
          </span>
          <div className="grid grid-cols-[78px_auto_78px] items-end gap-3">
            <BangziCounter
              count={round?.sticks.riichi ?? 0}
              label="立直"
              type="riichi"
            />
            <div className="flex h-[45px] min-w-[90px] items-center justify-center gap-0">
              {doraIndicators.length > 0 ? (
                doraIndicators.map((tile, index) => (
                  <DoraIndicatorTile
                    key={`${getPaifuTileCode(tile)}-${index}`}
                    tile={tile}
                  />
                ))
              ) : (
                <span className="grid h-[36px] min-w-[26px] place-items-center rounded bg-[rgba(255,255,255,0.08)] text-xs text-[#9ab0c1]">
                  -
                </span>
              )}
            </div>
            <BangziCounter
              count={round?.sticks.honba ?? 0}
              label="本场"
              type="honba"
            />
          </div>
        </div>

        <RemainingTileCount count={round?.wallTileCount ?? 0} />
      </div>
    </div>
  );
}
