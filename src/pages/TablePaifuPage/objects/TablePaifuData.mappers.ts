import type {
  AgariResult as BackendAgariResult,
  Paifu as BackendPaifu,
  PaifuAction as BackendPaifuAction,
} from '@/objects';

import type {
  PaifuAction,
  PaifuRoundSummary,
  TablePaifuDetail,
} from '../types';
import {
  normalizeOptionalBoolean,
  normalizeOptionalNumber,
  normalizeOptionalObject,
  normalizeOptionalString,
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
      }),
      matchRecordId:
        normalizeOptionalString(
          legacy.metadata?.matchRecordId ?? summary.matchRecordId,
        ) ?? null,
    },
    rounds: (legacy.rounds ?? []).map(toPaifuRound),
    finalStandings: (item.finalStandings ?? []).map((standing) => ({
      ...standing,
      uma: standing.uma ?? undefined,
      oka: standing.oka ?? undefined,
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
    rounds: item.rounds.map((round) => {
      const events = round.actions.map(toBackendPaifuAction);

      return {
        descriptor: round.descriptor,
        players: (item.metadata.seats ?? []).map((seat) => ({
          playerId: seat.playerId,
          seat: seat.seat,
          initialHand: {
            tiles: round.initialHands[seat.playerId] ?? [],
          },
          track: {
            events: events.filter((event) => event.actor === seat.playerId),
          },
        })),
        timeline: { events },
        result: toBackendAgariResult(round.result),
      };
    }),
    finalStandings: item.finalStandings.map((standing) => ({
      ...standing,
      uma: standing.uma ?? null,
      oka: standing.oka ?? null,
    })),
  };
}

function toPaifuRound(round: PaifuRoundSummary | BackendPaifu['rounds'][number]): PaifuRoundSummary {
  const paifuRound = round as BackendPaifu['rounds'][number];
  const legacyRound = round as PaifuRoundSummary;
  const actions = legacyRound.actions ?? paifuRound.timeline?.events ?? [];
  const initialHands =
    legacyRound.initialHands ??
    Object.fromEntries(
      (paifuRound.players ?? []).map((player) => [
        player.playerId,
        player.initialHand.tiles,
      ]),
    );

  return {
    ...round,
    initialHands,
    actions: actions.map(toPaifuAction),
    result: {
      ...round.result,
      winner: normalizeOptionalString(round.result.winner),
      target: normalizeOptionalString(round.result.target),
      han: normalizeOptionalNumber(round.result.han),
      fu: normalizeOptionalNumber(round.result.fu),
      doraIndicators: normalizeStringArray(round.result.doraIndicators),
      uraDoraIndicators: normalizeStringArray(round.result.uraDoraIndicators),
      uraDoraVisible: normalizeOptionalBoolean(round.result.uraDoraVisible),
      settlement: normalizeOptionalObject(round.result.settlement),
      tenpaiPlayerIds: normalizeStringArray(round.result.tenpaiPlayerIds),
      wins: normalizeResultWins(round.result.wins),
    },
  };
}

function toPaifuAction(action: PaifuAction): PaifuAction {
  return {
    ...action,
    actor: normalizeOptionalString(action.actor),
    tile: normalizeOptionalString(action.tile),
    fromPlayer: normalizeOptionalString(action.fromPlayer),
    targetSequenceNo: normalizeOptionalNumber(action.targetSequenceNo),
    shantenAfterAction: normalizeOptionalNumber(action.shantenAfterAction),
    handTilesAfterAction: normalizeStringArray(action.handTilesAfterAction),
    revealedTiles: normalizeStringArray(action.revealedTiles) ?? [],
    note: normalizeOptionalString(action.note),
  };
}

function toBackendPaifuAction(action: PaifuAction): BackendPaifuAction {
  return {
    sequenceNo: action.sequenceNo,
    actor: normalizeOptionalString(action.actor) ?? null,
    actionType: action.actionType,
    tile: normalizeOptionalString(action.tile) ?? null,
    fromPlayer: normalizeOptionalString(action.fromPlayer) ?? null,
    targetSequenceNo: normalizeOptionalNumber(action.targetSequenceNo) ?? null,
    shantenAfterAction: normalizeOptionalNumber(action.shantenAfterAction) ?? null,
    handTilesAfterAction: normalizeStringArray(action.handTilesAfterAction) ?? null,
    revealedTiles: normalizeStringArray(action.revealedTiles) ?? [],
    note: normalizeOptionalString(action.note) ?? null,
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
    doraIndicators: normalizeStringArray(result.doraIndicators) ?? null,
    uraDoraIndicators: normalizeStringArray(result.uraDoraIndicators) ?? null,
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
    doraIndicators: normalizeStringArray(win.doraIndicators) ?? null,
    uraDoraIndicators: normalizeStringArray(win.uraDoraIndicators) ?? null,
    uraDoraVisible: normalizeOptionalBoolean(win.uraDoraVisible) ?? null,
    points: win.points,
  };
}
