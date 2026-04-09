import type { TableDetail, TournamentTableSummary } from '@/domain';
import type { TournamentTableContract } from './contracts/operations';

export function mapTournamentTable(item: TournamentTableContract): TournamentTableSummary {
  const playerIds = item.seats?.map((seat) => seat.playerId) ?? [];
  const status = item.status ?? 'WaitingPreparation';

  return {
    id: item.id,
    tournamentId: item.tournamentId ?? '',
    stageId: item.stageId,
    tableCode: `Table ${String(item.tableNo).padStart(2, '0')}`,
    status,
    playerIds,
    seatCount: playerIds.length || 4,
  };
}

export function mapTableDetail(item: TournamentTableContract): TableDetail {
  const status = item.status ?? 'WaitingPreparation';

  return {
    id: item.id,
    tournamentId: item.tournamentId ?? '',
    stageId: item.stageId,
    tableNo: item.tableNo,
    status,
    seats:
      item.seats?.map((seat) => ({
        seat: seat.seat,
        playerId: seat.playerId,
        disconnected: seat.disconnected ?? false,
        ready: seat.ready ?? false,
      })) ?? [],
  };
}
