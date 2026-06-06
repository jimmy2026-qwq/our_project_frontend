import type { SeatWind } from '@/objects/tournament';

import type { TablePaifuDetail } from '../../../../types';
import {
  formatPoints,
  getRoundPlayerId,
} from '../../../../functions/getReplay';
import { centerPointPositionClasses } from '../../functions/getPaifuTableLayout';
import type { CenterScoreDisplay } from './CenterTable.types';

interface CenterPointProps {
  isRelativeScoreMode?: boolean;
  onToggleRelativeScoreMode?: () => void;
  paifu: TablePaifuDetail;
  referencePoints?: number;
  scoreDisplay?: CenterScoreDisplay;
  seat: SeatWind;
}

export function CenterPoint({
  isRelativeScoreMode = false,
  onToggleRelativeScoreMode,
  paifu,
  referencePoints,
  scoreDisplay,
  seat,
}: CenterPointProps) {
  const playerId = getRoundPlayerId(paifu, seat);
  const canToggleScoreMode = seat === 'East' && Boolean(onToggleRelativeScoreMode);
  const displayScore =
    isRelativeScoreMode && typeof referencePoints === 'number'
      ? (scoreDisplay?.points ?? 0) - referencePoints
      : scoreDisplay?.points;
  const scoreClassName = [
    'rounded-lg bg-[rgba(2,12,20,0.48)] px-2 py-1 font-semibold',
    getMainScoreClassName(isRelativeScoreMode, displayScore),
  ].join(' ');
  const scoreText = isRelativeScoreMode
    ? formatRelativeScore(displayScore ?? 0)
    : formatPoints(displayScore);

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
      {canToggleScoreMode ? (
        <button
          aria-label="切换点数显示"
          className={`${scoreClassName} cursor-pointer transition-colors hover:bg-[rgba(236,197,122,0.14)]`}
          onClick={onToggleRelativeScoreMode}
          type="button"
        >
          {scoreText}
        </button>
      ) : (
        <span className={scoreClassName}>{scoreText}</span>
      )}
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

function formatRelativeScore(value: number) {
  if (value === 0) {
    return '+0';
  }

  return value > 0
    ? `+${formatPoints(value)}`
    : `-${formatPoints(Math.abs(value))}`;
}

function formatScoreDelta(value: number) {
  if (value === 0) {
    return '+0';
  }

  return value > 0
    ? `+${formatPoints(value)}`
    : `-${formatPoints(Math.abs(value))}`;
}

function getMainScoreClassName(isRelativeScoreMode: boolean, value?: number) {
  if (!isRelativeScoreMode) {
    return 'text-[#f2f7fb]';
  }

  return getScoreDeltaClassName(value ?? 0);
}

function getScoreDeltaClassName(value: number) {
  if (value > 0) {
    return 'text-[#57e38d]';
  }

  if (value < 0) {
    return 'text-[#ff6d6d]';
  }

  return 'text-[#ffd98a]';
}
