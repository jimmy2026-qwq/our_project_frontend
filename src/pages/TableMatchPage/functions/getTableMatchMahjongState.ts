import {
  isPaifuTile,
  MahjongTableStatuses,
  PaifuActionType,
  toPaifuTile,
  type MahjongPublicEventView,
  type MahjongTableView,
  type PaifuTile,
} from '@/objects';
import { ApiError } from '@/system/api/http';

export const liveMahjongRefreshIntervalMs = 1000;

export function shouldOpenFinalSettlement(
  previous: MahjongTableView | null,
  next: MahjongTableView,
) {
  if (!previous || !next.currentRound?.result) {
    return false;
  }

  return isTerminalMahjongStatus(next.status) && !isTerminalMahjongStatus(previous.status);
}

export function getAcceptedEventFlashDurationMs(
  event: MahjongPublicEventView,
) {
  if (event.actionType === PaifuActionType.Win) {
    return 1000;
  }

  if (
    event.actionType === PaifuActionType.Chi ||
    event.actionType === PaifuActionType.Pon
  ) {
    return 500;
  }

  return event.actionType === PaifuActionType.Riichi ? 1000 : 1500;
}

export function createMahjongTableQuery({
  operatorId,
  viewerPlayerId,
}: {
  operatorId: string;
  viewerPlayerId: string;
}) {
  return {
    includeLegalActions: true,
    operatorId: operatorId || null,
    viewerPlayerId: viewerPlayerId || null,
  };
}

export function parseMahjongPublicEventView(
  value: unknown,
): MahjongPublicEventView | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.sequenceNo !== 'number' ||
    typeof value.actionType !== 'string'
  ) {
    return null;
  }

  return {
    sequenceNo: value.sequenceNo,
    actor: typeof value.actor === 'string' ? value.actor : null,
    actionType: value.actionType as MahjongPublicEventView['actionType'],
    tile: parsePaifuTile(value.tile),
    tiles: Array.isArray(value.tiles)
      ? value.tiles
          .map(parsePaifuTile)
          .filter((tile): tile is PaifuTile => Boolean(tile))
      : [],
    note: typeof value.note === 'string' ? value.note : null,
  };
}

function parsePaifuTile(value: unknown): PaifuTile | null {
  if (typeof value === 'string') {
    try {
      return toPaifuTile(value);
    } catch {
      return null;
    }
  }

  return isPaifuTile(value) ? value : null;
}

export function isLiveMahjongStatus(status: MahjongTableView['status']) {
  return (
    status === MahjongTableStatuses.InProgress ||
    status === MahjongTableStatuses.WaitingPlayerAction ||
    status === MahjongTableStatuses.WaitingCallDecision ||
    status === MahjongTableStatuses.RoundEnded
  );
}

export function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `action-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getMahjongErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '牌局状态读取失败。';
}

function isTerminalMahjongStatus(status: MahjongTableView['status']) {
  return (
    status === MahjongTableStatuses.Finished ||
    status === MahjongTableStatuses.Archived
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
