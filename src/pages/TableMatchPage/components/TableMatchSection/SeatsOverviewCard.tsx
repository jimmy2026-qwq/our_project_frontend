import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusPill,
} from '@/components/ui';
import { SeatWinds, type TableSeat } from '@/objects/tournament';
import type { TableDetail } from '@/pages/shared_objects/tournament/TableDetail';

import {
  getSeatStatusLabel,
  getSeatStatusTone,
  getTableStatusLabel,
} from '../../functions/TableMatch.labels';
import type { TableSeatMap } from '../../functions/getTableSeatMap';
import { SeatCard } from './SeatCard';

interface SeatsOverviewCardProps {
  table: TableDetail;
  seatMap: TableSeatMap;
  ownSeat: TableSeat | null;
  playerNames: Record<string, string>;
  isRegisteredPlayer: boolean;
}

/** 实时牌桌页展示四个座位玩家、准备和连接状态的卡片。 */
export function SeatsOverviewCard({
  table,
  seatMap,
  ownSeat,
  playerNames,
  isRegisteredPlayer,
}: SeatsOverviewCardProps) {
  const allReady = table.seats.every((seat) => seat.ready);

  return (
    <Card>
      <CardHeader>
        <CardTitle>座位概览</CardTitle>
        <CardDescription>
          查看四个座位的玩家分配、准备状态和连接状态，便于开局前确认当前牌桌情况。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isRegisteredPlayer && ownSeat ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[rgba(236,197,122,0.22)] bg-[rgba(236,197,122,0.08)] px-4 py-3 text-sm text-[#c7d6e2]">
            <div className="grid gap-1">
              <strong className="text-[#f2f7fb]">
                我的座位：{ownSeat.seat}
              </strong>
              <span>
                {ownSeat.disconnected
                  ? '当前座位已标记为断线，暂时不能在这里修改准备状态。'
                  : ownSeat.ready
                    ? '你当前已在这桌标记为已准备。'
                    : '比赛开始前，你可以在这里确认自己的准备状态。'}
              </span>
            </div>
            <StatusPill tone={getSeatStatusTone(ownSeat)}>
              {getSeatStatusLabel(ownSeat)}
            </StatusPill>
          </div>
        ) : null}
        <SeatsLayout
          table={table}
          seatMap={seatMap}
          allReady={allReady}
          playerNames={playerNames}
        />
      </CardContent>
    </Card>
  );
}

/** 根据座位顺序排布四家座位卡。 */
function SeatsLayout({
  table,
  seatMap,
  allReady,
  playerNames,
}: {
  table: TableDetail;
  seatMap: TableSeatMap;
  allReady: boolean;
  playerNames: Record<string, string>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)] md:grid-rows-[auto_auto_auto]">
      <SeatCard
        wind={SeatWinds.North}
        playerId={seatMap[SeatWinds.North]?.playerId ?? 'Unassigned'}
        playerName={getSeatPlayerName(
          seatMap[SeatWinds.North]?.playerId,
          playerNames,
        )}
        ready={seatMap[SeatWinds.North]?.ready ?? false}
        disconnected={seatMap[SeatWinds.North]?.disconnected ?? false}
        className="md:col-start-2 md:row-start-1"
      />
      <SeatCard
        wind={SeatWinds.West}
        playerId={seatMap[SeatWinds.West]?.playerId ?? 'Unassigned'}
        playerName={getSeatPlayerName(
          seatMap[SeatWinds.West]?.playerId,
          playerNames,
        )}
        ready={seatMap[SeatWinds.West]?.ready ?? false}
        disconnected={seatMap[SeatWinds.West]?.disconnected ?? false}
        className="md:col-start-1 md:row-start-2"
      />
      <div className="rounded-[28px] border border-[rgba(236,197,122,0.22)] bg-[radial-gradient(circle_at_top,rgba(236,197,122,0.16),transparent_55%),linear-gradient(180deg,rgba(17,38,52,0.92),rgba(8,20,30,0.96))] p-6 text-center shadow-[0_18px_48px_rgba(0,0,0,0.22)] md:col-start-2 md:row-start-2">
        <p className="mb-2 text-sm uppercase tracking-[0.32em] text-[#9ab0c1]">
          Riichi Table
        </p>
        <div className="grid gap-2 text-sm text-[#c7d6e2]">
          <span>状态：{getTableStatusLabel(table.status)}</span>
          <span>已就位人数：{table.seats.length} / 4</span>
          <span>准备情况：{allReady ? '全部就绪' : '仍在等待玩家准备'}</span>
        </div>
      </div>
      <SeatCard
        wind={SeatWinds.East}
        playerId={seatMap[SeatWinds.East]?.playerId ?? 'Unassigned'}
        playerName={getSeatPlayerName(
          seatMap[SeatWinds.East]?.playerId,
          playerNames,
        )}
        ready={seatMap[SeatWinds.East]?.ready ?? false}
        disconnected={seatMap[SeatWinds.East]?.disconnected ?? false}
        className="md:col-start-3 md:row-start-2"
      />
      <SeatCard
        wind={SeatWinds.South}
        playerId={seatMap[SeatWinds.South]?.playerId ?? 'Unassigned'}
        playerName={getSeatPlayerName(
          seatMap[SeatWinds.South]?.playerId,
          playerNames,
        )}
        ready={seatMap[SeatWinds.South]?.ready ?? false}
        disconnected={seatMap[SeatWinds.South]?.disconnected ?? false}
        className="md:col-start-2 md:row-start-3"
      />
    </div>
  );
}

function getSeatPlayerName(
  playerId: string | undefined,
  playerNames: Record<string, string>,
) {
  if (!playerId) {
    return 'Unassigned';
  }

  return playerNames[playerId] ?? playerId;
}
