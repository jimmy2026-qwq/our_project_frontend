import type {
  TournamentMatchRecordView,
  TournamentSummaryView,
  TournamentTableView,
} from '@/objects';
import type {
  MatchRecordSummary,
  TableDetail,
  TournamentTableSummary,
} from './TournamentViews';

export interface TournamentDirectoryEntryView {
  id: string;
  name: string;
}

export function mapTournamentDirectoryEntry(
  item: TournamentDirectoryEntryView | TournamentSummaryView,
): TournamentDirectoryEntryView {
  return {
    id: 'id' in item ? item.id : item.tournamentId,
    name: item.name,
  };
}

export function mapTournamentTable(item: TournamentTableView): TournamentTableSummary {
  const playerIds = item.seats?.map((seat) => seat.playerId) ?? [];
  const status = item.status ?? 'WaitingPreparation';
  const tableId = item.id ?? item.tableId ?? '';

  return {
    id: tableId,
    tournamentId: item.tournamentId ?? '',
    stageId: item.stageId,
    tableCode: `Table ${String(item.tableNo).padStart(2, '0')}`,
    status,
    playerIds,
    seatCount: playerIds.length || 4,
  };
}

export function mapTableDetail(item: TournamentTableView): TableDetail {
  const status = item.status ?? 'WaitingPreparation';
  const tableId = item.id ?? item.tableId ?? '';

  return {
    id: tableId,
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

export function mapMatchRecordSummary(item: TournamentMatchRecordView | MatchRecordSummary): MatchRecordSummary {
  const legacy = item as Partial<MatchRecordSummary>;
  const record = item as MatchRecordSummary & {
    recordId?: string;
    generatedAt?: string;
    seatResults?: Array<{ playerId: string; placement: number }>;
    notes?: string[];
  };
  const winner = record.seatResults?.find((seat) => seat.placement === 1);

  return {
    ...item,
    id: legacy.id ?? record.recordId ?? '',
    recordedAt: legacy.recordedAt ?? record.generatedAt ?? '',
    winnerId: legacy.winnerId ?? winner?.playerId ?? '',
    summary: legacy.summary ?? record.notes?.join(' / ') ?? '',
  };
}
