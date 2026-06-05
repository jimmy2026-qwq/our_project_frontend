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

function unwrapBackendOption(value: unknown) {
  if (Array.isArray(value) && value.length <= 1) {
    return value[0];
  }

  return value ?? undefined;
}

function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = unwrapBackendOption(value);
  return typeof normalized === 'string' ? normalized : undefined;
}

function normalizeOptionalNumber(value: unknown): number | undefined {
  const normalized = unwrapBackendOption(value);
  return typeof normalized === 'number' ? normalized : undefined;
}

function normalizeOptionalBoolean(value: unknown): boolean | undefined {
  const normalized = unwrapBackendOption(value);
  return typeof normalized === 'boolean' ? normalized : undefined;
}

function normalizeOptionalObject<T>(value: unknown): T | undefined {
  const normalized = unwrapBackendOption(value);
  return normalized && typeof normalized === 'object'
    ? (normalized as T)
    : undefined;
}

function normalizeStringArray(value: unknown): string[] | undefined {
  const normalized =
    Array.isArray(value) && value.length === 1 && Array.isArray(value[0])
      ? value[0]
      : value;

  return Array.isArray(normalized)
    ? normalized.filter((item): item is string => typeof item === 'string')
    : undefined;
}

function normalizeResultWins(
  value: unknown,
): PaifuRoundSummary['result']['wins'] {
  const normalized =
    Array.isArray(value) && value.length === 1 && Array.isArray(value[0])
      ? value[0]
      : value;

  if (!Array.isArray(normalized)) {
    return undefined;
  }

  return normalized
    .map((item) =>
      item && typeof item === 'object'
        ? normalizeResultWin(item as Record<string, unknown>)
        : undefined,
    )
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function normalizeResultWin(item: Record<string, unknown>) {
  const winner = normalizeOptionalString(item.winner);

  if (!winner) {
    return undefined;
  }

  return {
    winner,
    target: normalizeOptionalString(item.target),
    han: normalizeOptionalNumber(item.han),
    fu: normalizeOptionalNumber(item.fu),
    yaku: Array.isArray(item.yaku) ? item.yaku : [],
    doraIndicators: normalizeStringArray(item.doraIndicators),
    uraDoraIndicators: normalizeStringArray(item.uraDoraIndicators),
    uraDoraVisible: normalizeOptionalBoolean(item.uraDoraVisible),
    points: normalizeOptionalNumber(item.points) ?? 0,
  };
}

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
