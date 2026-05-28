import type { SeatWind } from '@/objects/tournament';

import type { TablePaifuDetail } from '../../../../types';
import { formatPoints, getRoundPlayerId } from '../../../../objects/replay';
import { centerPointPositionClasses } from '../../objects/paifuTableLayout';
import type { CenterScoreDisplay } from './CenterTable.types';

interface CenterPointProps {
  paifu: TablePaifuDetail;
  scoreDisplay?: CenterScoreDisplay;
  seat: SeatWind;
}

export function CenterPoint({ paifu, scoreDisplay, seat }: CenterPointProps) {
  const playerId = getRoundPlayerId(paifu, seat);

  if (!playerId) {
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
        {formatPoints(scoreDisplay?.points)}
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
