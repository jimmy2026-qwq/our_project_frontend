import { describe, expect, it } from 'vitest';

import { mapClubMember } from './ClubMappers';

describe('mapClubMember', () => {
  it('maps club member views using affiliatedClubIds', () => {
    const member = mapClubMember({
      playerId: 'player-2',
      userId: 'user-2',
      nickname: 'Bravo',
      registeredAt: '2026-01-01T00:00:00Z',
      currentRank: {
        platform: 'Custom',
        tier: 'Unranked',
      },
      status: 'Banned',
      elo: 1400,
      clubId: 'club-z',
      affiliatedClubIds: ['club-z'],
      roles: {
        isRegisteredPlayer: true,
        isClubAdmin: false,
        isTournamentAdmin: false,
        isSuperAdmin: false,
      },
      bannedReason: 'test',
    });

    expect(member).toEqual({
      playerId: 'player-2',
      applicantUserId: 'user-2',
      displayName: 'Bravo',
      playerStatus: 'Banned',
      elo: 1400,
      clubIds: ['club-z'],
    });
  });
});
