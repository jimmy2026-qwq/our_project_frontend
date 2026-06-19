import type {
  AgariResult as BackendAgariResult,
  Paifu as BackendPaifu,
  PaifuAction as BackendPaifuAction,
} from '@/objects';

import type { PaifuAction, PaifuRound as PaifuRoundSummary } from '@/objects';
import type { TablePaifuDetail } from '../objects/TablePaifuDetail';
import {
  normalizeOptionalBoolean,
  normalizeOptionalNumber,
  normalizeOptionalObject,
  normalizeOptionalString,
  normalizePaifuTile,
  normalizePaifuTileArray,
  normalizeResultWins,
  normalizeStringArray,
} from './TablePaifuData.normalizers';

export function toPaifuSummary(
  item: BackendPaifu | TablePaifuDetail,
): TablePaifuDetail {
  const legacy = item as Partial<TablePaifuDetail>;
  const summary = item as TablePaifuDetail & {
    paifuId?: string;
    tableId?: string;
    tournamentId?: string;
    stageId?: string;
    recordedAt?: string;
    matchRecordId?: unknown;
  };

  return {
    ...item,
    id: legacy.id ?? summary.paifuId ?? '',
    metadata: {
      ...(legacy.metadata ?? {
        tableId: summary.tableId ?? '',
        tournamentId: summary.tournamentId ?? '',
        stageId: summary.stageId ?? '',
        recordedAt: summary.recordedAt ?? '',
        source: 'backend',
        seats: [],
      }),
      matchRecordId:
        normalizeOptionalString(
          legacy.metadata?.matchRecordId ?? summary.matchRecordId,
        ) ?? null,
    },
    rounds: (legacy.rounds ?? []).map(toPaifuRound),
    finalStandings: (item.finalStandings ?? []).map((standing) => ({
      ...standing,
      uma: standing.uma ?? null,
      oka: standing.oka ?? null,
    })),
  };
}

export function toBackendPaifu(item: TablePaifuDetail): BackendPaifu {
  return {
    id: item.id,
    metadata: {
      recordedAt: item.metadata.recordedAt,
      source: item.metadata.source ?? 'frontend',
      tableId: item.metadata.tableId,
      tournamentId: item.metadata.tournamentId,
      stageId: item.metadata.stageId,
      seats: item.metadata.seats ?? [],
      matchRecordId: item.metadata.matchRecordId ?? null,
    },
    rounds: item.rounds.map((round) => ({
      descriptor: round.descriptor,
      players: round.players.map((player) => ({
        ...player,
        initialHand: {
          tiles: normalizePaifuTileArray(player.initialHand.tiles) ?? [],
        },
        track: {
          events: player.track.events.map(toBackendPaifuAction),
        },
      })),
      timeline: {
        events: round.timeline.events.map(toBackendPaifuAction),
      },
      result: toBackendAgariResult(round.result),
    })),
    finalStandings: item.finalStandings.map((standing) => ({
      ...standing,
      uma: standing.uma ?? null,
      oka: standing.oka ?? null,
    })),
  };
}

function toPaifuRound(round: BackendPaifu['rounds'][number]): PaifuRoundSummary {
  return {
    ...round,
    players: round.players.map((player) => ({
      ...player,
      initialHand: {
        tiles: normalizePaifuTileArray(player.initialHand.tiles) ?? [],
      },
      track: {
        events: player.track.events.map(toPaifuAction),
      },
    })),
    timeline: {
      events: round.timeline.events.map(toPaifuAction),
    },
    result: toPaifuResult(round.result),
  };
}

function toPaifuAction(action: PaifuAction): PaifuAction {
  return {
    ...action,
    actor: normalizeOptionalString(action.actor) ?? null,
    tile: normalizePaifuTile(action.tile) ?? null,
    fromPlayer: normalizeOptionalString(action.fromPlayer) ?? null,
    targetSequenceNo: normalizeOptionalNumber(action.targetSequenceNo) ?? null,
    shantenAfterAction: normalizeOptionalNumber(action.shantenAfterAction) ?? null,
    handTilesAfterAction:
      normalizePaifuTileArray(action.handTilesAfterAction) ?? null,
    revealedTiles: normalizePaifuTileArray(action.revealedTiles) ?? [],
    note: normalizeOptionalString(action.note) ?? null,
  };
}

function toBackendPaifuAction(action: PaifuAction): BackendPaifuAction {
  return {
    sequenceNo: action.sequenceNo,
    actor: normalizeOptionalString(action.actor) ?? null,
    actionType: action.actionType,
    tile: normalizePaifuTile(action.tile) ?? null,
    fromPlayer: normalizeOptionalString(action.fromPlayer) ?? null,
    targetSequenceNo: normalizeOptionalNumber(action.targetSequenceNo) ?? null,
    shantenAfterAction: normalizeOptionalNumber(action.shantenAfterAction) ?? null,
    handTilesAfterAction:
      normalizePaifuTileArray(action.handTilesAfterAction) ?? null,
    revealedTiles: normalizePaifuTileArray(action.revealedTiles) ?? [],
    note: normalizeOptionalString(action.note) ?? null,
  };
}

function toPaifuResult(result: PaifuRoundSummary['result']): PaifuRoundSummary['result'] {
  return {
    ...result,
    winner: normalizeOptionalString(result.winner) ?? null,
    target: normalizeOptionalString(result.target) ?? null,
    han: normalizeOptionalNumber(result.han) ?? null,
    fu: normalizeOptionalNumber(result.fu) ?? null,
    doraIndicators: normalizePaifuTileArray(result.doraIndicators) ?? null,
    uraDoraIndicators: normalizePaifuTileArray(result.uraDoraIndicators) ?? null,
    uraDoraVisible: normalizeOptionalBoolean(result.uraDoraVisible) ?? null,
    settlement: normalizeOptionalObject(result.settlement) ?? null,
    tenpaiPlayerIds: normalizeStringArray(result.tenpaiPlayerIds) ?? null,
    wins: normalizeResultWins(result.wins),
  };
}

function toBackendAgariResult(result: PaifuRoundSummary['result']): BackendAgariResult {
  return {
    outcome: result.outcome,
    winner: normalizeOptionalString(result.winner) ?? null,
    target: normalizeOptionalString(result.target) ?? null,
    han: normalizeOptionalNumber(result.han) ?? null,
    fu: normalizeOptionalNumber(result.fu) ?? null,
    yaku: result.yaku,
    doraIndicators: normalizePaifuTileArray(result.doraIndicators) ?? null,
    uraDoraIndicators: normalizePaifuTileArray(result.uraDoraIndicators) ?? null,
    uraDoraVisible: normalizeOptionalBoolean(result.uraDoraVisible) ?? null,
    points: result.points,
    scoreChanges: result.scoreChanges,
    settlement: normalizeOptionalObject(result.settlement) ?? null,
    tenpaiPlayerIds: normalizeStringArray(result.tenpaiPlayerIds) ?? null,
    wins: (result.wins ?? []).map(toBackendAgariWinResult),
  };
}

function toBackendAgariWinResult(
  win: NonNullable<PaifuRoundSummary['result']['wins']>[number],
) {
  return {
    winner: win.winner,
    target: normalizeOptionalString(win.target) ?? null,
    han: normalizeOptionalNumber(win.han) ?? null,
    fu: normalizeOptionalNumber(win.fu) ?? null,
    yaku: win.yaku,
    doraIndicators: normalizePaifuTileArray(win.doraIndicators) ?? null,
    uraDoraIndicators: normalizePaifuTileArray(win.uraDoraIndicators) ?? null,
    uraDoraVisible: normalizeOptionalBoolean(win.uraDoraVisible) ?? null,
    points: win.points,
  };
}
