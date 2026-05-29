export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function normalizePlayerIds(value: unknown) {
  return Array.isArray(value)
    ? value.filter(
        (playerId): playerId is string => typeof playerId === 'string',
      )
    : [];
}
