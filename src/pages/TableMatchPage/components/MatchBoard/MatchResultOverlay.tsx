import type { AgariResult, MahjongSeatView } from '@/objects';
import { getMahjongYakuLabel } from '@/objects';
import { WinningTile } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PaifuOverlays/WinningResultIndicators';
import { ResultTile } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';
import {
  formatPoints,
  formatYakuValue,
} from '@/pages/TablePaifuPage/functions/getReplay';

interface MatchResultOverlayProps {
  playerNames: Record<string, string>;
  result: AgariResult | null;
  seats: MahjongSeatView[];
}

export function MatchResultOverlay({
  playerNames,
  result,
  seats,
}: MatchResultOverlayProps) {
  if (!result) {
    return null;
  }

  return (
    <div className="absolute inset-[34px] z-[24] grid rounded-[28px] bg-[rgba(0,0,0,0.84)] p-8 text-[#f2f7fb] shadow-[0_30px_90px_rgba(0,0,0,0.58)]">
      {isWinOutcome(result.outcome) && result.winner ? (
        <WinningResultContent
          playerNames={playerNames}
          result={result}
          seats={seats}
        />
      ) : (
        <DrawResultContent playerNames={playerNames} result={result} />
      )}
    </div>
  );
}

function WinningResultContent({
  playerNames,
  result,
  seats,
}: {
  playerNames: Record<string, string>;
  result: AgariResult;
  seats: MahjongSeatView[];
}) {
  if (!result.winner) {
    return null;
  }

  const winnerSeat = seats.find((seat) => seat.playerId === result.winner);
  const winnerHand = winnerSeat?.handTiles ?? [];
  const winnerMelds = winnerSeat?.melds ?? [];
  const winningTile =
    result.target && result.scoreChanges.length > 0
      ? findWinningTileFromTarget(seats, result.target)
      : winnerHand[winnerHand.length - 1];
  const displayHand =
    result.outcome === 'Tsumo' && winningTile && winnerHand.length > 0
      ? removeFirstTile(winnerHand, winningTile)
      : winnerHand;
  const winLabel = result.outcome === 'Tsumo' ? '自摸' : '荣和';

  return (
    <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6">
      <div className="grid justify-items-center gap-3">
        <span className="rounded-xl border border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.14)] px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#ffd98a]">
          {winLabel}
        </span>
        <strong className="max-w-full truncate text-2xl text-[#f2f7fb]">
          {getPlayerName(result.winner, playerNames)}
        </strong>
        {result.target ? (
          <span className="text-sm font-semibold text-[#c7d6e2]">
            放铳：{getPlayerName(result.target, playerNames)}
          </span>
        ) : null}
      </div>

      <div className="grid content-start gap-5 overflow-auto">
        <div className="flex items-end justify-center gap-0">
          {displayHand.map((tile, index) => (
            <ResultTile
              key={`${result.winner}-result-${tile}-${index}`}
              tile={tile}
            />
          ))}
          {winnerMelds.length > 0 ? (
            <div className="ml-6 flex items-end gap-3 border-l border-[rgba(255,255,255,0.18)] pl-5">
              {winnerMelds.map((meld, meldIndex) => (
                <div
                  key={`${result.winner}-result-meld-${meld.meldType}-${meldIndex}`}
                  className="flex items-end gap-0"
                >
                  {(meld.tiles ?? []).map((tile, tileIndex) => (
                    <ResultTile
                      key={`${result.winner}-result-meld-${meldIndex}-${tile}-${tileIndex}`}
                      tile={tile}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : null}
          {winningTile ? <WinningTile label={winLabel} tile={winningTile} /> : null}
        </div>

        {result.yaku.length > 0 ? (
          <div className="mx-auto grid w-[min(680px,88%)] content-start gap-3">
            {result.yaku.map((yaku) => (
              <div
                key={`${yaku.kind}-${yaku.han}`}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-[rgba(255,255,255,0.16)] py-3 text-xl"
              >
                <span>{getMahjongYakuLabel(yaku.kind)}</span>
                <span className="text-[#ffd98a]">
                  {formatYakuValue(yaku.han)}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <ResultFooter playerNames={playerNames} result={result} />
    </div>
  );
}

function DrawResultContent({
  playerNames,
  result,
}: {
  playerNames: Record<string, string>;
  result: AgariResult;
}) {
  const tenpaiPlayerIds = result.tenpaiPlayerIds ?? [];

  return (
    <div className="grid h-full grid-rows-[1fr_auto] gap-6">
      <div className="grid content-center justify-items-center gap-5">
        <span className="rounded-xl border border-[rgba(214,162,255,0.38)] bg-[rgba(148,77,255,0.16)] px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#d6a2ff]">
          {getDrawLabel(result.outcome)}
        </span>
        {result.outcome === 'ExhaustiveDraw' ? (
          <div className="grid justify-items-center gap-3">
            <strong className="text-3xl font-bold tracking-[0.16em] text-[#d6a2ff] [text-shadow:0_2px_18px_rgba(148,77,255,0.72)]">
              荒牌流局
            </strong>
            <div className="flex flex-wrap justify-center gap-2 text-sm font-semibold text-[#c7d6e2]">
              {tenpaiPlayerIds.length > 0 ? (
                tenpaiPlayerIds.map((playerId) => (
                  <span
                    key={playerId}
                    className="rounded-lg border border-[rgba(214,162,255,0.22)] bg-[rgba(255,255,255,0.08)] px-3 py-1"
                  >
                    听牌：{getPlayerName(playerId, playerNames)}
                  </span>
                ))
              ) : (
                <span>无人听牌</span>
              )}
            </div>
          </div>
        ) : (
          <strong className="text-3xl font-bold tracking-[0.16em] text-[#d6a2ff] [text-shadow:0_2px_18px_rgba(148,77,255,0.72)]">
            途中流局
          </strong>
        )}
      </div>

      <ResultFooter playerNames={playerNames} result={result} />
    </div>
  );
}

function ResultFooter({
  playerNames,
  result,
}: {
  playerNames: Record<string, string>;
  result: AgariResult;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 self-end pb-1">
      <div className="grid gap-1 text-sm font-semibold text-[#c7d6e2]">
        {result.scoreChanges.map((change) => (
          <span key={change.playerId}>
            {getPlayerName(change.playerId, playerNames)}
            <span
              className={
                change.delta >= 0 ? 'text-[#57e38d]' : 'text-[#ff6d6d]'
              }
            >
              {' '}
              {formatDelta(change.delta)}
            </span>
          </span>
        ))}
      </div>

      {isWinOutcome(result.outcome) ? (
        <div className="grid justify-items-end gap-1 text-right">
          <span className="block text-sm uppercase tracking-[0.2em] text-[#9ab0c1]">
            点数
          </span>
          <strong className="text-[2rem] text-[#ffd98a]">
            {formatPoints(result.points)}
            {typeof result.han === 'number' && typeof result.fu === 'number'
              ? ` / ${result.han}番${result.fu}符`
              : ''}
          </strong>
        </div>
      ) : null}
    </div>
  );
}

function isWinOutcome(outcome: string) {
  return outcome === 'Ron' || outcome === 'Tsumo';
}

function getDrawLabel(outcome: string) {
  if (outcome === 'ExhaustiveDraw') {
    return '流局结算';
  }

  return '本局结束';
}

function getPlayerName(playerId: string, playerNames: Record<string, string>) {
  return playerNames[playerId] ?? playerId;
}

function formatDelta(value: number) {
  if (value > 0) {
    return `+${formatPoints(value)}`;
  }

  if (value < 0) {
    return `-${formatPoints(Math.abs(value))}`;
  }

  return '+0';
}

function removeFirstTile(tiles: string[], tile: string) {
  let removed = false;

  return tiles.filter((item) => {
    if (!removed && item === tile) {
      removed = true;
      return false;
    }

    return true;
  });
}

function findWinningTileFromTarget(seats: MahjongSeatView[], target: string) {
  const targetSeat = seats.find((seat) => seat.playerId === target);

  return targetSeat?.river?.[targetSeat.river.length - 1]?.tile;
}
