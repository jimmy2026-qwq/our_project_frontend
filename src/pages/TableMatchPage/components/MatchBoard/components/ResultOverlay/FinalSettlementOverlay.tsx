import type { MahjongTableView, SeatWind } from '@/objects';
import { formatPoints } from '@/pages/TablePaifuPage/functions/getReplay';

interface FinalSettlementOverlayProps {
  mahjongTable: MahjongTableView;
  onConfirm: () => void;
  playerNames: Record<string, string>;
}

const seatOrder: SeatWind[] = ['East', 'South', 'West', 'North'];

export function FinalSettlementOverlay({
  mahjongTable,
  onConfirm,
  playerNames,
}: FinalSettlementOverlayProps) {
  const standings = [...mahjongTable.seats]
    .sort(
      (left, right) =>
        right.points - left.points ||
        seatOrder.indexOf(left.seat) - seatOrder.indexOf(right.seat),
    )
    .map((seat, index) => ({
      ...seat,
      placement: index + 1,
    }));

  return (
    <div className="absolute inset-[34px] z-[30] grid rounded-[28px] bg-[rgba(0,0,0,0.88)] p-8 text-left text-[#f2f7fb] shadow-[0_30px_90px_rgba(0,0,0,0.62)]">
      <div className="grid h-full grid-rows-[auto_1fr_auto] gap-6">
        <div className="grid justify-items-center gap-3">
          <span className="rounded-xl border border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.14)] px-4 py-1 text-sm font-bold tracking-[0.2em] text-[#ffd98a]">
            牌桌结算
          </span>
          <strong className="max-w-full truncate text-2xl text-[#f2f7fb]">
            最终排名
          </strong>
        </div>

        <div className="mx-auto grid w-[min(680px,92%)] content-center gap-3 overflow-auto">
          {standings.map((standing) => (
            <div
              key={standing.playerId}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)_9rem] items-center gap-4 border-b border-[rgba(255,255,255,0.16)] py-4 text-2xl font-bold"
            >
              <span
                className={`justify-self-start rounded-xl px-3 py-1 text-base ${getPlacementClassName(
                  standing.placement,
                )}`}
              >
                {standing.placement}位
              </span>
              <span className="truncate text-[#f2f7fb]">
                {playerNames[standing.playerId] ?? standing.playerId}
              </span>
              <span className="justify-self-end text-right tabular-nums text-[#f2f7fb]">
                {formatPoints(standing.points)}
              </span>
            </div>
          ))}
        </div>

        <button
          className="justify-self-center rounded-xl border border-[rgba(236,197,122,0.42)] bg-[rgba(236,197,122,0.16)] px-6 py-2 text-sm font-bold text-[#ffd98a] transition hover:bg-[rgba(236,197,122,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd98a]"
          onClick={onConfirm}
          type="button"
        >
          确认
        </button>
      </div>
    </div>
  );
}

function getPlacementClassName(placement: number) {
  if (placement === 1) {
    return 'border border-[rgba(255,217,138,0.46)] bg-[rgba(255,217,138,0.2)] text-[#ffd98a]';
  }

  if (placement === 2) {
    return 'border border-[rgba(218,226,232,0.42)] bg-[rgba(218,226,232,0.16)] text-[#dae2e8]';
  }

  if (placement === 3) {
    return 'border border-[rgba(205,127,50,0.46)] bg-[rgba(205,127,50,0.16)] text-[#cd7f32]';
  }

  return 'border border-[rgba(242,247,251,0.28)] bg-[rgba(242,247,251,0.1)] text-[#f2f7fb]';
}
