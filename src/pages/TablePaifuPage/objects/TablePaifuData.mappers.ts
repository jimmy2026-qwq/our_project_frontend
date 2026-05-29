import type { TournamentPaifuSummaryView } from '@/objects';

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

export function toPaifuSummary(
  item: TournamentPaifuSummaryView | TablePaifuDetail,
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
    finalStandings: item.finalStandings ?? [],
  };
}

function toPaifuRound(round: PaifuRoundSummary): PaifuRoundSummary {
  return {
    ...round,
    actions: round.actions.map(toPaifuAction),
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
    },
  };
}

function toPaifuAction(action: PaifuAction): PaifuAction {
  return {
    ...action,
    actor: normalizeOptionalString(action.actor),
    tile: normalizeOptionalString(action.tile),
    shantenAfterAction: normalizeOptionalNumber(action.shantenAfterAction),
    handTilesAfterAction: normalizeStringArray(action.handTilesAfterAction),
    revealedTiles: normalizeStringArray(action.revealedTiles) ?? [],
    note: normalizeOptionalString(action.note),
  };
}
