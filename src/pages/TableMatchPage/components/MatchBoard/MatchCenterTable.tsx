import type { MahjongSeatView, MahjongTableView, SeatWind } from '@/objects';
import {
  BangziCounter,
  RemainingTileCount,
} from '@/pages/TablePaifuPage/components/PaifuHandTable/components/CenterTable/CenterTableCounters';
import type { CenterScoreDisplay } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/CenterTable/CenterTable.types';
import { DoraIndicatorTile } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';
import { centerPointPositionClasses } from '@/pages/TablePaifuPage/components/PaifuHandTable/functions/getPaifuTableLayout';
import { formatPoints } from '@/pages/TablePaifuPage/functions/getReplay';

import { getRoundLabel } from './matchBoardLabels';

const seatOrder: SeatWind[] = ['East', 'South', 'West', 'North'];

interface MatchCenterTableProps {
  mahjongTable: MahjongTableView;
  scoreDisplays?: Record<SeatWind, CenterScoreDisplay>;
  seatsByDisplaySeat: Record<SeatWind, MahjongSeatView | null>;
}

export function MatchCenterTable({
  mahjongTable,
  scoreDisplays,
  seatsByDisplaySeat,
}: MatchCenterTableProps) {
  const round = mahjongTable.currentRound;
  const doraIndicators =
    round?.doraIndicators.slice(0, round.doraIndicatorVisibleCount) ?? [];

  return (
    <div className="absolute left-1/2 top-1/2 z-[10] grid h-[260px] w-[min(88vw,420px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[24px] border border-[rgba(236,197,122,0.34)] bg-[rgba(6,17,26,0.78)] text-center shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-[10px]">
      {seatOrder.map((seat) => (
        <MatchCenterPoint
          key={`${seat}-center-point`}
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
                  <DoraIndicatorTile key={`${tile}-${index}`} tile={tile} />
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

function MatchCenterPoint({
  scoreDisplay,
  seat,
  seatView,
}: {
  scoreDisplay?: CenterScoreDisplay;
  seat: SeatWind;
  seatView: MahjongSeatView | null;
}) {
  if (!seatView) {
    return null;
  }

  return (
    <div
      className={[
        'absolute z-[3] grid min-w-[72px] justify-items-center gap-0.5 text-center text-sm font-semibold [text-shadow:0_2px_10px_rgba(0,0,0,0.58)]',
        centerPointPositionClasses[seat],
      ].join(' ')}
    >
      <span className="rounded-lg bg-[rgba(2,12,20,0.48)] px-2 py-1 text-[#f2f7fb]">
        {formatPoints(scoreDisplay?.points ?? seatView.points)}
      </span>
      {scoreDisplay?.showDelta ? (
        <span
          className={[
            'rounded-md bg-[rgba(2,12,20,0.3)] px-1.5 py-0.5 text-xs font-bold',
            getScoreDeltaClassName(scoreDisplay.delta),
          ].join(' ')}
        >
          {formatScoreDelta(scoreDisplay.delta)}
        </span>
      ) : null}
    </div>
  );
}

function formatScoreDelta(value: number) {
  if (value === 0) {
    return '+0';
  }

  return value > 0
    ? `+${formatPoints(value)}`
    : `-${formatPoints(Math.abs(value))}`;
}

function getScoreDeltaClassName(value: number) {
  if (value > 0) {
    return 'text-[#57e38d]';
  }

  if (value < 0) {
    return 'text-[#ff6d6d]';
  }

  return 'text-[#f2f7fb]';
}
