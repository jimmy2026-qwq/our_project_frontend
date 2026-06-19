import type { PaifuRoundSummary } from '../types';

function unwrapBackendOption(value: unknown) {
  if (Array.isArray(value) && value.length <= 1) {
    return value[0];
  }

  return value ?? undefined;
}

export function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = unwrapBackendOption(value);
  return typeof normalized === 'string' ? normalized : undefined;
}

export function normalizeOptionalNumber(value: unknown): number | undefined {
  const normalized = unwrapBackendOption(value);
  return typeof normalized === 'number' ? normalized : undefined;
}

export function normalizeOptionalBoolean(value: unknown): boolean | undefined {
  const normalized = unwrapBackendOption(value);
  return typeof normalized === 'boolean' ? normalized : undefined;
}

export function normalizeOptionalObject<T>(value: unknown): T | undefined {
  const normalized = unwrapBackendOption(value);
  return normalized && typeof normalized === 'object'
    ? (normalized as T)
    : undefined;
}

export function normalizeStringArray(value: unknown): string[] | undefined {
  const normalized =
    Array.isArray(value) && value.length === 1 && Array.isArray(value[0])
      ? value[0]
      : value;

  return Array.isArray(normalized)
    ? normalized.filter((item): item is string => typeof item === 'string')
    : undefined;
}

export function normalizeResultWins(
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
