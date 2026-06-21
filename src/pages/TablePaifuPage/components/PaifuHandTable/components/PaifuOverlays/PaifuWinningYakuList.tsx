import type { PaifuTile, Yaku } from '@/objects';
import { getMahjongYakuLabel } from '@/objects';

import { formatYakuValue } from '../../../../functions/getReplayCore';
import { IndicatorPanel } from './WinningResultIndicators';

/** 和牌结果中展示役种和番数的列表。 */
export function PaifuWinningYakuList({
  doraIndicatorCount,
  doraIndicators,
  uraDoraIndicators,
  uraDoraVisible,
  yakuList,
}: {
  doraIndicatorCount: number;
  doraIndicators: PaifuTile[];
  uraDoraIndicators: PaifuTile[];
  uraDoraVisible: boolean;
  yakuList: Yaku[];
}) {
  return (
    <div className="mx-auto grid w-[min(680px,88%)] content-start gap-3">
      <div className="mb-2 flex justify-center gap-3">
        <IndicatorPanel
          label="表宝牌"
          shownCount={doraIndicatorCount}
          tiles={doraIndicators}
        />
        <IndicatorPanel
          label="里宝牌"
          shownCount={doraIndicatorCount}
          tiles={uraDoraIndicators}
          visible={uraDoraVisible}
        />
      </div>
      {yakuList.map((yaku, index) => (
        <div
          key={`${yaku.kind}-${yaku.han}-${index}`}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-[rgba(255,255,255,0.16)] py-3 text-xl"
        >
          <span>{getMahjongYakuLabel(yaku.kind)}</span>
          <span className="text-[#ffd98a]">{formatYakuValue(yaku.han)}</span>
        </div>
      ))}
    </div>
  );
}
