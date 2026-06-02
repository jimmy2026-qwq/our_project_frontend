import { Badge, StatusPill } from '@/components/ui';
import type { MahjongTableView } from '@/objects';
import { DoraIndicatorTile } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/TileViews';

import {
  getMahjongPhaseLabel,
  getMahjongStatusLabel,
  getRoundLabel,
} from './matchBoardLabels';

interface MatchCenterTableProps {
  mahjongTable: MahjongTableView;
}

export function MatchCenterTable({ mahjongTable }: MatchCenterTableProps) {
  const round = mahjongTable.currentRound;
  const doraIndicators =
    round?.doraIndicators.slice(0, round.doraIndicatorVisibleCount) ?? [];

  return (
    <div className="absolute left-1/2 top-1/2 z-[10] grid min-h-[190px] w-[min(76vw,300px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[22px] border border-[rgba(236,197,122,0.24)] bg-[rgba(5,14,23,0.82)] p-4 text-center shadow-[0_24px_60px_rgba(0,0,0,0.34)] backdrop-blur">
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <StatusPill
            tone={
              mahjongTable.status === 'WaitingPlayerAction' ||
              mahjongTable.status === 'WaitingCallDecision'
                ? 'warning'
                : 'success'
            }
          >
            {getMahjongStatusLabel(mahjongTable.status)}
          </StatusPill>
          {round ? <Badge>{getMahjongPhaseLabel(round.phase)}</Badge> : null}
        </div>

        <div>
          <div className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[#ecc57a]">
            {round ? getRoundLabel(round.descriptor) : '未开局'}
          </div>
          <strong className="block text-3xl text-[#f2f7fb]">
            {round ? `${round.wallTileCount}` : '--'}
          </strong>
          <span className="text-xs font-semibold text-[#c7d6e2]">剩余牌</span>
        </div>

        <div className="flex items-center justify-center gap-3 text-sm font-semibold text-[#c7d6e2]">
          <span>本场 {round?.sticks.honba ?? 0}</span>
          <span>立直棒 {round?.sticks.riichi ?? 0}</span>
        </div>

        <div className="flex min-h-[38px] items-center justify-center gap-1">
          {doraIndicators.length > 0 ? (
            doraIndicators.map((tile, index) => (
              <DoraIndicatorTile key={`${tile}-${index}`} tile={tile} />
            ))
          ) : (
            <span className="text-xs font-semibold text-[#8ea8b9]">
              宝牌未翻开
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
