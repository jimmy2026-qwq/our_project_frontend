import type { PlayerProfileView, PlayerStatus } from '@/objects/player';
import type {
  AppealTicketView,
  TournamentMatchRecordView,
  TournamentTableView,
} from '@/objects';
import type { PlayerProfile } from '@/pages/objects/PlayerProfile';
import type {
  AppealSummary,
  MatchRecordSeatResultSummary,
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/pages/objects/TournamentViews';

function toPlayerClubIds(item: PlayerProfileView): string[] {
  return Array.from(
    new Set([
      ...(item.clubId ? [item.clubId] : []),
      ...(item.affiliatedClubIds ?? []),
    ]),
  );
}

function toPlayerStatus(status: PlayerStatus): PlayerProfile['playerStatus'] {
  return status === 'Suspended' ? 'Inactive' : status;
}

export function toPlayerProfile(item: PlayerProfileView): PlayerProfile {
  return {
    playerId: item.playerId,
    displayName: item.nickname,
    playerStatus: toPlayerStatus(item.status),
    currentRank: item.currentRank,
    elo: item.elo,
    clubIds: toPlayerClubIds(item),
  };
}

export function toTournamentTableSummary(
  item: TournamentTableView,
): TournamentTableSummary {
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

export function toMatchRecordSummary(
  item: TournamentMatchRecordView | MatchRecordSummary,
): MatchRecordSummary {
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
  const seatResults: MatchRecordSeatResultSummary[] = orderedResults.map(
    (seat) => ({
      playerId: seat.playerId,
      placement: seat.placement,
      finalPoints: seat.finalPoints,
      scoreDelta: seat.scoreDelta,
    }),
  );
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
    seatResults,
  };
}

export function toAppealSummary(ticket: AppealTicketView): AppealSummary {
  const lastLog = ticket.logs[ticket.logs.length - 1];

  return {
    id: ticket.appealId,
    tournamentId: ticket.tournamentId,
    stageId: ticket.stageId,
    tableId: ticket.tableId,
    status: ticket.status,
    openedBy: ticket.openedBy,
    createdBy: ticket.openedBy,
    description: ticket.description,
    attachments: ticket.attachments.map((attachment) => attachment.uri),
    priority: ticket.priority,
    assigneeId: ticket.assigneeId,
    dueAt: ticket.dueAt,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    resolution: ticket.resolution,
    verdict: lastLog?.note ?? null,
    reopenCount: ticket.reopenCount,
  };
}
