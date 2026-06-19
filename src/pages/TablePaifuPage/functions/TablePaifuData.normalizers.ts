import {
  isPaifuTile,
  isPaifuTileSuit,
  toPaifuTile,
  type PaifuTile,
  type PaifuRound as PaifuRoundSummary,
} from '@/objects';

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

export function normalizePaifuTile(value: unknown): PaifuTile | undefined {
  if (typeof value === 'string') {
    try {
      return toPaifuTile(value);
    } catch {
      return undefined;
    }
  }

  if (isPaifuTile(value)) {
    return value;
  }

  if (
    value &&
    typeof value === 'object' &&
    typeof (value as PaifuTile).rank === 'number' &&
    isPaifuTileSuit((value as PaifuTile).suit)
  ) {
    return {
      rank: (value as PaifuTile).rank,
      suit: (value as PaifuTile).suit,
    };
  }

  return undefined;
}

export function normalizePaifuTileArray(
  value: unknown,
): PaifuTile[] | undefined {
  const normalized =
    Array.isArray(value) && value.length === 1 && Array.isArray(value[0])
      ? value[0]
      : value;

  if (!Array.isArray(normalized)) {
    return undefined;
  }

  return normalized
    .map(normalizePaifuTile)
    .filter((item): item is PaifuTile => Boolean(item));
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
    target: normalizeOptionalString(item.target) ?? null,
    han: normalizeOptionalNumber(item.han) ?? null,
    fu: normalizeOptionalNumber(item.fu) ?? null,
    yaku: Array.isArray(item.yaku) ? item.yaku : [],
    doraIndicators: normalizePaifuTileArray(item.doraIndicators) ?? null,
    uraDoraIndicators: normalizePaifuTileArray(item.uraDoraIndicators) ?? null,
    uraDoraVisible: normalizeOptionalBoolean(item.uraDoraVisible) ?? null,
    points: normalizeOptionalNumber(item.points) ?? 0,
  };
}
