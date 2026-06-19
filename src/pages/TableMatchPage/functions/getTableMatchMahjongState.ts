import type { MahjongPublicEventView, MahjongTableView } from '@/objects';
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
  if (event.actionType === 'Win') {
    return 1000;
  }

  if (event.actionType === 'Chi' || event.actionType === 'Pon') {
    return 500;
  }

  return event.actionType === 'Riichi' ? 1000 : 1500;
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
    tile: typeof value.tile === 'string' ? value.tile : null,
    tiles: Array.isArray(value.tiles)
      ? value.tiles.filter((tile): tile is string => typeof tile === 'string')
      : [],
    note: typeof value.note === 'string' ? value.note : null,
  };
}

export function isLiveMahjongStatus(status: MahjongTableView['status']) {
  return (
    status === 'InProgress' ||
    status === 'WaitingPlayerAction' ||
    status === 'WaitingCallDecision' ||
    status === 'RoundEnded'
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
  return status === 'Finished' || status === 'Archived';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
