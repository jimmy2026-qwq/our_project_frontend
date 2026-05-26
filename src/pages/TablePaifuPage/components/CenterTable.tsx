import type { SeatWind } from '@/objects/tournament';

import type { PaifuRoundSummary, TablePaifuDetail } from '../types';
import {
  formatPoints,
  getDoraIndicators,
  getRemainingTileCount,
  getRoundPlayerId,
  getRoundTitle,
  seatOrder,
} from '../objects/replay';
import { DoraIndicatorTile } from './TileViews';
import { centerPointPositionClasses } from './paifuTableLayout';

export type CenterScoreDisplay = {
  delta: number;
  points: number;
  showDelta: boolean;
};

export type TableStickDisplay = {
  honba: number;
  riichi: number;
};

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

const bangziImages = {
  honba: '/mahjong-soul/honba_bangzi.png',
  riichi: '/mahjong-soul/riichi_bangzi.png',
} as const;

function BangziImage({ type }: { type: keyof typeof bangziImages }) {
  return (
    <img
      alt=""
      className="h-[34px] w-auto shrink-0 select-none object-contain"
      draggable={false}
      src={bangziImages[type]}
    />
  );
}

function BangziCounter({
  count,
  label,
  type,
}: {
  count: number;
  label: string;
  type: keyof typeof bangziImages;
}) {
  return (
    <div className="grid min-w-[78px] justify-items-center gap-0.5">
      <span className="text-[0.58rem] font-semibold tracking-[0.14em] text-[#9ab0c1]">
        {label}
      </span>
      <div className="flex items-center justify-center gap-1 rounded-full bg-[rgba(2,12,20,0.3)] px-2 py-1">
        <BangziImage type={type} />
        <span className="min-w-[22px] text-left text-xs font-bold text-[#f2f7fb]">
          {`x${count}`}
        </span>
      </div>
    </div>
  );
}

function RemainingTileCount({ count }: { count: number }) {
  return (
    <div className="grid justify-items-center gap-0.5">
      <span className="text-[0.66rem] font-semibold tracking-[0.18em] text-[#9ab0c1]">
        {'\u5269\u4f59\u724c'}
      </span>
      <strong className="text-2xl leading-none text-[#f2f7fb]">
        {count}
        <span className="ml-1 text-sm font-medium text-[#c7d6e2]">
          {'\u5f20'}
        </span>
      </strong>
    </div>
  );
}

export function CenterPoint({
  paifu,
  scoreDisplay,
  seat,
}: {
  paifu: TablePaifuDetail;
  scoreDisplay?: CenterScoreDisplay;
  seat: SeatWind;
}) {
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

export function CenterTableInfo({
  isExhaustiveDrawResult,
  isRoundPickerOpen,
  onToggleRoundPicker,
  replayStep,
  round,
  tableSticks,
}: {
  isExhaustiveDrawResult: boolean;
  isRoundPickerOpen: boolean;
  onToggleRoundPicker: () => void;
  replayStep: number;
  round: PaifuRoundSummary;
  tableSticks: TableStickDisplay;
}) {
  const doraIndicators = getDoraIndicators(round, replayStep);
  const remainingTileCount = getRemainingTileCount(round, replayStep);

  return (
    <div className="relative z-[2] grid justify-items-center gap-3">
      <button
        aria-expanded={isRoundPickerOpen}
        className="rounded-xl px-2 py-1 text-[0.76rem] font-semibold tracking-[0.16em] text-[#ecc57a] transition hover:bg-[rgba(236,197,122,0.12)] hover:text-[#ffd98a]"
        onClick={onToggleRoundPicker}
        type="button"
      >
        {getRoundTitle(round)}
      </button>
      {isExhaustiveDrawResult ? (
        <strong className="py-7 text-3xl font-bold tracking-[0.16em] text-[#d6a2ff] [text-shadow:0_2px_18px_rgba(148,77,255,0.72)]">
          {'\u8352\u724c\u6d41\u5c40'}
        </strong>
      ) : (
        <>
          <div className="grid justify-items-center gap-1">
            <span className="text-[0.66rem] font-semibold tracking-[0.18em] text-[#9ab0c1]">
              {'\u5b9d\u724c\u6307\u793a\u724c'}
            </span>
            <div className="grid grid-cols-[78px_auto_78px] items-end gap-3">
              <BangziCounter
                count={tableSticks.riichi}
                label={'\u7acb\u76f4'}
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
                count={tableSticks.honba}
                label={'\u672c\u573a'}
                type="honba"
              />
            </div>
          </div>
          <RemainingTileCount count={remainingTileCount} />
        </>
      )}
    </div>
  );
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
}: {
  isExhaustiveDrawResult: boolean;
  isRoundPickerOpen: boolean;
  onToggleRoundPicker: () => void;
  paifu: TablePaifuDetail;
  replayStep: number;
  round: PaifuRoundSummary;
  scoreDisplays: Record<SeatWind, CenterScoreDisplay>;
  tableSticks: TableStickDisplay;
}) {
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

export function RoundPicker({
  onSelectRound,
  rounds,
  selectedRoundIndex,
}: {
  onSelectRound: (index: number) => void;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
}) {
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
