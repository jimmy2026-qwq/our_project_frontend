import type { SeatWind } from '@/objects/tournament';

import type { PaifuAction, PaifuRoundSummary, TablePaifuDetail } from '../types';
import {
  formatPoints,
  formatYakuValue,
  getDoraIndicators,
  getReplaySnapshot,
  getRoundPlayerId,
  getVisibleDoraIndicatorCount,
  isPlayerTenpai,
  removeFirstTile,
  seatOrder,
} from '../objects/replay';
import { DoraIndicatorTile, ResultBackTile, ResultTile } from './TileViews';
import { operationPositionClasses } from './paifuTableLayout';

export type ActiveOperation = {
  key: number;
  label: string;
  seat: SeatWind;
};

export function OperationFlash({
  operation,
}: {
  operation?: ActiveOperation;
}) {
  if (!operation) {
    return null;
  }

  return (
    <div
      key={operation.key}
      className={[
        'pointer-events-none absolute z-[12] text-3xl font-bold text-white opacity-100 [text-shadow:0_2px_12px_rgba(0,0,0,0.74)]',
        operationPositionClasses[operation.seat],
      ].join(' ')}
    >
      {operation.label}
    </div>
  );
}

export function ExhaustiveDrawStatusMarkers({
  paifu,
  round,
}: {
  paifu: TablePaifuDetail;
  round: PaifuRoundSummary;
}) {
  return (
    <>
      {seatOrder.map((seat) => {
        const playerId = getRoundPlayerId(paifu, seat);

        if (!playerId) {
          return null;
        }

        return (
          <div
            key={`${seat}-exhaustive-status`}
            className={[
              'pointer-events-none absolute z-[12] text-2xl font-bold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.78)]',
              operationPositionClasses[seat],
            ].join(' ')}
          >
            {isPlayerTenpai(round, playerId) ? '\u542c\u724c' : '\u6ca1\u542c'}
          </div>
        );
      })}
    </>
  );
}

function clampIndicatorCount(count: number) {
  return Math.max(0, Math.min(5, count));
}

function getIndicatorSlots({
  count,
  tiles,
  visible = true,
}: {
  count: number;
  tiles?: string[];
  visible?: boolean;
}) {
  const visibleCount = visible ? clampIndicatorCount(count) : 0;

  return Array.from({ length: 5 }, (_, index) =>
    index < visibleCount ? tiles?.[index] : undefined,
  );
}

function IndicatorPanel({
  label,
  shownCount,
  tiles,
  visible,
}: {
  label: string;
  shownCount: number;
  tiles?: string[];
  visible?: boolean;
}) {
  return (
    <div className="grid min-w-[190px] justify-items-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-4 py-3">
      <span className="text-xs font-semibold tracking-[0.18em] text-[#9ab0c1]">
        {label}
      </span>
      <div className="flex h-[40px] items-center justify-center gap-0">
        {getIndicatorSlots({ count: shownCount, tiles, visible }).map((tile, index) =>
          tile ? (
            <DoraIndicatorTile key={`${label}-${tile}-${index}`} tile={tile} />
          ) : (
            <ResultBackTile key={`${label}-back-${index}`} />
          ),
        )}
      </div>
    </div>
  );
}

function WinningTile({
  label,
  tile,
}: {
  label: string;
  tile: string;
}) {
  return (
    <span className="relative ml-5 inline-flex">
      <ResultTile tile={tile} />
      <span className="absolute bottom-0 right-0 grid h-[26px] min-w-[26px] place-items-center rounded bg-[rgba(0,0,0,0.48)] px-1 text-[0.95rem] font-black leading-none text-[#ff4c4c] [text-shadow:0_1px_6px_rgba(0,0,0,0.86)]">
        {label}
      </span>
    </span>
  );
}

export function WinningResultOverlay({
  action,
  onConfirm,
  replaySnapshot,
  replayStep,
  round,
}: {
  action?: PaifuAction;
  onConfirm: () => void;
  replaySnapshot: ReturnType<typeof getReplaySnapshot>;
  replayStep: number;
  round: PaifuRoundSummary;
}) {
  const winnerId = round.result.winner ?? action?.actor;
  const winningTile = action?.tile;
  const winLabel = round.result.outcome === 'Tsumo' ? '\u81ea\u6478' : '\u8363\u548c';

  if (!action || !winnerId) {
    return null;
  }

  const winnerHand =
    replaySnapshot.hands[winnerId] ?? round.initialHands[winnerId] ?? [];
  const displayHand = winningTile
    ? removeFirstTile(winnerHand, winningTile)
    : winnerHand;
  const doraIndicators =
    round.result.doraIndicators ?? getDoraIndicators(round, replayStep);
  const doraIndicatorCount = getVisibleDoraIndicatorCount(round, replayStep);
  const uraDoraIndicators = round.result.uraDoraIndicators ?? [];
  const uraDoraVisible = round.result.uraDoraVisible ?? false;

  return (
    <div className="absolute inset-[34px] z-[20] grid rounded-[28px] bg-[rgba(0,0,0,0.84)] p-8 text-[#f2f7fb] shadow-[0_30px_90px_rgba(0,0,0,0.58)]">
      <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6">
        <div className="flex items-end justify-center gap-0">
          {displayHand.map((tile, index) => (
            <ResultTile key={`${winnerId}-result-${tile}-${index}`} tile={tile} />
          ))}
          {winningTile ? (
            <WinningTile label={winLabel} tile={winningTile} />
          ) : null}
        </div>

        <div className="mx-auto grid w-[min(680px,88%)] content-start gap-3 self-start">
          <div className="mb-2 flex justify-center gap-3">
            <IndicatorPanel
              label={'\u8868\u5b9d\u724c'}
              shownCount={doraIndicatorCount}
              tiles={doraIndicators}
            />
            <IndicatorPanel
              label={'\u91cc\u5b9d\u724c'}
              shownCount={doraIndicatorCount}
              tiles={uraDoraIndicators}
              visible={uraDoraVisible}
            />
          </div>
          {round.result.yaku.map((yaku) => (
            <div
              key={`${yaku.name}-${yaku.han}`}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-[rgba(255,255,255,0.16)] py-3 text-xl"
            >
              <span>{yaku.name}</span>
              <span className="text-[#ffd98a]">{formatYakuValue(yaku.han)}</span>
            </div>
          ))}
        </div>

        <div className="grid justify-items-end gap-4 self-end pb-1">
          <div className="text-right">
            <span className="block text-sm uppercase tracking-[0.2em] text-[#9ab0c1]">
              {'\u70b9\u6570'}
            </span>
            <strong className="text-[2rem] text-[#ffd98a]">
              {formatPoints(round.result.points)}
            </strong>
          </div>
          <button
            className="min-h-[42px] rounded-2xl border border-[rgba(236,197,122,0.46)] bg-[rgba(236,197,122,0.16)] px-8 py-2 text-base font-semibold text-[#ffd98a] transition-[border-color,background-color,color] duration-200 hover:border-[rgba(236,197,122,0.68)] hover:bg-[rgba(236,197,122,0.24)]"
            onClick={onConfirm}
            type="button"
          >
            {'\u786e\u8ba4'}
          </button>
        </div>
      </div>
    </div>
  );
}
