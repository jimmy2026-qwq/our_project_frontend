import { describe, expect, it } from 'vitest';

import { parseDashboardOwner } from '@/pages/objects/opsanalytics';

describe('parseDashboardOwner', () => {
  it('parses player dashboard owners from string contracts', () => {
    expect(parseDashboardOwner('player:player-42')).toEqual({
      ownerId: 'player-42',
      ownerType: 'player',
    });
  });

  it('parses club dashboard owners from string contracts', () => {
    expect(parseDashboardOwner('club:club-77')).toEqual({
      ownerId: 'club-77',
      ownerType: 'club',
    });
  });

  it('falls back to an unknown player owner when the contract string is malformed', () => {
    expect(
      parseDashboardOwner(
        'unknown-format' as `player:${string}` | `club:${string}`,
      ),
    ).toEqual({
      ownerId: 'unknown',
      ownerType: 'player',
    });
  });
});
