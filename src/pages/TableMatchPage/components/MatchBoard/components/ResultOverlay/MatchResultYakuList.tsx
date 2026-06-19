import { getMahjongYakuLabel } from '@/objects';
import type { MahjongResultWinLike } from '@/components/mahjong-result/functions/getMahjongResultSequence';
import { formatYakuValue } from '@/pages/TablePaifuPage/functions/getReplayCore';

export function YakuList({
  className,
  compact = false,
  yaku,
}: {
  className?: string;
  compact?: boolean;
  yaku: MahjongResultWinLike['yaku'];
}) {
  return (
    <div className={`grid content-start gap-3 ${className ?? ''}`}>
      {yaku.map((item, index) => (
        <div
          key={`${item.kind}-${item.han}-${index}`}
          className={`grid grid-cols-[minmax(0,1fr)_auto] items-center border-b border-[rgba(255,255,255,0.16)] ${
            compact ? 'py-2 text-sm' : 'py-3 text-xl'
          }`}
        >
          <span>{getMahjongYakuLabel(item.kind)}</span>
          <span className="text-[#ffd98a]">{formatYakuValue(item.han)}</span>
        </div>
      ))}
    </div>
  );
}
