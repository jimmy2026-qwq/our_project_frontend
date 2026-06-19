import type { AgariResult } from '@/objects';

export function getOverlayResultKey(result: AgariResult | null) {
  if (!result) {
    return 'none';
  }

  return [
    result.outcome,
    result.winner ?? '',
    result.target ?? '',
    result.points,
    (result.wins ?? [])
      .map((win) => `${win.winner}:${win.target ?? ''}:${win.points}`)
      .join('|'),
    result.scoreChanges
      .map((change) => `${change.playerId}:${change.delta}`)
      .join('|'),
  ].join(':');
}
