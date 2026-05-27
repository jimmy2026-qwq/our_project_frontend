import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusPill,
} from '@/components/ui';
import type { TableDetail } from '@/pages/objects/tournament';

import {
  getSeatStatusLabel,
  getSeatStatusTone,
  getTableStatusLabel,
} from '../../objects/TableMatch.labels';
import type { TableSeat, TableSeatMap } from '../../objects/TableMatch.types';
import { SeatCard } from './SeatCard';
import { TableMatchAppealAction } from './TableMatchAppealAction';

interface SeatsOverviewCardProps {
  table: TableDetail;
  seatMap: TableSeatMap;
  ownSeat: TableSeat | null;
  canFileAppeal: boolean;
  isRegisteredPlayer: boolean;
  operatorId: string;
  onOpenAppeal: () => void;
}

export function SeatsOverviewCard({
  table,
  seatMap,
  ownSeat,
  canFileAppeal,
  isRegisteredPlayer,
  operatorId,
  onOpenAppeal,
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
              <strong className="text-[#f2f7fb]">我的座位：{ownSeat.seat}</strong>
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
        <SeatsLayout table={table} seatMap={seatMap} allReady={allReady} />
        <TableMatchAppealAction
          status={table.status}
          ownSeat={ownSeat}
          operatorId={operatorId}
          canFileAppeal={canFileAppeal}
          isRegisteredPlayer={isRegisteredPlayer}
          onOpenAppeal={onOpenAppeal}
        />
      </CardContent>
    </Card>
  );
}

function SeatsLayout({
  table,
  seatMap,
  allReady,
}: {
  table: TableDetail;
  seatMap: TableSeatMap;
  allReady: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)] md:grid-rows-[auto_auto_auto]">
      <SeatCard
        wind="North"
        playerId={seatMap.North?.playerId ?? 'Unassigned'}
        ready={seatMap.North?.ready ?? false}
        disconnected={seatMap.North?.disconnected ?? false}
        className="md:col-start-2 md:row-start-1"
      />
      <SeatCard
        wind="West"
        playerId={seatMap.West?.playerId ?? 'Unassigned'}
        ready={seatMap.West?.ready ?? false}
        disconnected={seatMap.West?.disconnected ?? false}
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
        wind="East"
        playerId={seatMap.East?.playerId ?? 'Unassigned'}
        ready={seatMap.East?.ready ?? false}
        disconnected={seatMap.East?.disconnected ?? false}
        className="md:col-start-3 md:row-start-2"
      />
      <SeatCard
        wind="South"
        playerId={seatMap.South?.playerId ?? 'Unassigned'}
        ready={seatMap.South?.ready ?? false}
        disconnected={seatMap.South?.disconnected ?? false}
        className="md:col-start-2 md:row-start-3"
      />
    </div>
  );
}
