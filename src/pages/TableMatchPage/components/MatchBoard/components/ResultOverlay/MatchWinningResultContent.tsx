import {
  getPaifuTileCode,
  type AgariResult,
  type MahjongSeatView,
} from '@/objects';
import type { MahjongResultWinLike } from '@/components/mahjong-result/functions/getMahjongResultSequence';
import {
  getResultSequenceStep,
  getWinYaku,
  isNagashiManganWin,
} from '@/components/mahjong-result/functions/getMahjongResultSequence';
import { WinningTile } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PaifuOverlays/WinningResultIndicators';
import { ResultTile } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';

import {
  findWinningTileFromTarget,
  getResultDisplayHand,
} from '../../functions/getMatchResultHand';
import {
  formatWinPointText,
  getWinHeadline,
  getWinLabel,
} from '../../functions/getMatchResultText';
import { ScoreSettlementPanel } from './MatchResultSettlementPanels';
import { ResultStepButton } from './MatchResultStepButton';
import { YakuList } from './MatchResultYakuList';

/** 实时对局和牌结果的主体内容。 */
export function WinningResultContent({
  nextLabel,
  onAdvance,
  playerNames,
  result,
  seats,
  step,
}: {
  nextLabel: string;
  onAdvance: () => void;
  playerNames: Record<string, string>;
  result: AgariResult;
  seats: MahjongSeatView[];
  step: NonNullable<ReturnType<typeof getResultSequenceStep>>;
}) {
  const headline = getWinHeadline(result, step, playerNames);

  if (step.kind === 'win') {
    return (
      <div className="grid h-full grid-rows-[minmax(0,1fr)_auto] gap-6">
        <SingleWinPanel
          headline={headline}
          nextLabel={nextLabel}
          onAdvance={onAdvance}
          result={result}
          seats={seats}
          win={step.win}
        />
      </div>
    );
  }

  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-6">
      <div className="grid justify-items-center gap-3">
        <span className="rounded-xl border border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.14)] px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#ffd98a]">
          {headline.badge}
        </span>
        <strong className="max-w-full truncate text-2xl text-[#f2f7fb]">
          {headline.title}
        </strong>
        {headline.subtitle ? (
          <span className="text-sm font-semibold text-[#c7d6e2]">
            {headline.subtitle}
          </span>
        ) : null}
      </div>

      <div className="grid content-center gap-5 overflow-auto">
        <ScoreSettlementPanel
          nextLabel={nextLabel}
          onAdvance={onAdvance}
          playerNames={playerNames}
          result={result}
        />
      </div>
    </div>
  );
}

/** 多家和牌时单个赢家的结果卡片。 */
function SingleWinPanel({
  headline,
  nextLabel,
  onAdvance,
  result,
  seats,
  win,
}: {
  headline: ReturnType<typeof getWinHeadline>;
  nextLabel: string;
  onAdvance: () => void;
  result: AgariResult;
  seats: MahjongSeatView[];
  win: MahjongResultWinLike;
}) {
  const winnerSeat = seats.find((seat) => seat.playerId === win.winner);
  const winnerHand = winnerSeat?.handTiles ?? [];
  const winnerMelds = winnerSeat?.melds ?? [];
  const targetId = win.target ?? result.target;
  const isNagashiMangan = isNagashiManganWin(win);
  const winningTile =
    isNagashiMangan
      ? undefined
      : targetId && result.scoreChanges.length > 0
        ? findWinningTileFromTarget(seats, targetId)
        : winnerHand[winnerHand.length - 1];
  const displayHand = getResultDisplayHand({
    result,
    tile: winningTile,
    winnerHand,
  });
  const winLabel = getWinLabel(result, win);
  const yakuList = getWinYaku(result, win);
  const pointText = formatWinPointText({
    fu: win.fu,
    han: win.han,
    points: win.points,
    yaku: yakuList,
  });

  return (
    <>
      <div className="grid content-start gap-5 overflow-auto">
        <div className="flex items-end justify-center gap-0">
          {displayHand.map((tile, index) => (
            <ResultTile
              key={`${win.winner}-result-${getPaifuTileCode(tile)}-${index}`}
              tile={tile}
            />
          ))}
          {winnerMelds.length > 0 ? (
            <div className="ml-6 flex items-end gap-3 border-l border-[rgba(255,255,255,0.18)] pl-5">
              {winnerMelds.map((meld, meldIndex) => (
                <div
                  key={`${win.winner}-result-meld-${meld.meldType}-${meldIndex}`}
                  className="flex items-end gap-0"
                >
                  {(meld.tiles ?? []).map((tile, tileIndex) => (
                    <ResultTile
                      key={`${win.winner}-result-meld-${meldIndex}-${getPaifuTileCode(tile)}-${tileIndex}`}
                      tile={tile}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : null}
          {winningTile ? <WinningTile label={winLabel} tile={winningTile} /> : null}
        </div>

        {yakuList.length > 0 ? (
          <YakuList className="mx-auto w-[min(680px,88%)]" yaku={yakuList} />
        ) : null}
        <ResultStepButton
          className="justify-self-center"
          label={nextLabel}
          onClick={onAdvance}
        />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 self-end pb-1">
        <WinHeadlinePanel headline={headline} />
        <div className="grid justify-items-end gap-1 justify-self-end text-right">
          <span className="block text-sm uppercase tracking-[0.2em] text-[#9ab0c1]">
            点数
          </span>
          <strong className="text-[2rem] text-[#ffd98a]">{pointText}</strong>
        </div>
      </div>
    </>
  );
}

/** 和牌结果顶部的赢家、放铳/自摸和点数概览。 */
function WinHeadlinePanel({
  headline,
}: {
  headline: ReturnType<typeof getWinHeadline>;
}) {
  return (
    <div className="grid max-w-[min(360px,58%)] justify-items-start gap-2 text-left">
      <span className="rounded-xl border border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.14)] px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#ffd98a]">
        {headline.badge}
      </span>
      <strong className="max-w-full truncate text-2xl text-[#f2f7fb]">
        {headline.title}
      </strong>
      {headline.subtitle ? (
        <span className="max-w-full truncate text-sm font-semibold text-[#c7d6e2]">
          {headline.subtitle}
        </span>
      ) : null}
    </div>
  );
}
