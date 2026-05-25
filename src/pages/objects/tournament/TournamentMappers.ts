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
  const playerIds = item.seats.map((seat) => seat.playerId);

  return {
    id: item.tableId,
    tournamentId: item.tournamentId,
    stageId: item.stageId,
    tableCode: `Table ${String(item.tableNo).padStart(2, '0')}`,
    status: item.status,
    playerIds,
    seatCount: playerIds.length || 4,
  };
}

export function mapTableDetail(item: TournamentTableView): TableDetail {
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

export function mapMatchRecordSummary(item: TournamentMatchRecordView | MatchRecordSummary): MatchRecordSummary {
  const legacy = item as Partial<MatchRecordSummary>;
  const record = item as MatchRecordSummary & {
    recordId?: string;
    generatedAt?: string;
    seatResults?: Array<{
      playerId: string;
      placement: number;
      finalPoints?: number;
      scoreDelta?: number;
    }>;
  };
  const orderedResults = [...(record.seatResults ?? [])].sort(
    (left, right) => left.placement - right.placement,
  );
  const winner = orderedResults.find((seat) => seat.placement === 1);
  const summary =
    legacy.summary ??
    (orderedResults.length > 0
      ? orderedResults
          .map((seat) => {
            const finalPoints =
              typeof seat.finalPoints === 'number'
                ? ` ${seat.finalPoints}点`
                : '';
            const scoreDelta =
              typeof seat.scoreDelta === 'number'
                ? ` (${seat.scoreDelta >= 0 ? '+' : ''}${seat.scoreDelta})`
                : '';

            return `${seat.placement}位 ${seat.playerId}${finalPoints}${scoreDelta}`;
          })
          .join(' / ')
      : '');

  return {
    ...item,
    id: legacy.id ?? record.recordId ?? '',
    recordedAt: legacy.recordedAt ?? record.generatedAt ?? '',
    winnerId: legacy.winnerId ?? winner?.playerId ?? '',
    summary,
  };
}
