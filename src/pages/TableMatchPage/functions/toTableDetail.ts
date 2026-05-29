import type { TournamentTableView } from '@/objects';
import type { TableDetail } from '@/pages/objects/TournamentViews';

export function toTableDetail(item: TournamentTableView): TableDetail {
  return {
    id: item.tableId,
    tournamentId: item.tournamentId,
    stageId: item.stageId,
    tableNo: item.tableNo,
    status: item.status,
    seats: item.seats.map((seat) => ({
      seat: seat.seat,
      playerId: seat.playerId,
      initialPoints: seat.initialPoints,
      disconnected: seat.disconnected,
      ready: seat.ready,
      clubId: seat.clubId,
    })),
  };
}
