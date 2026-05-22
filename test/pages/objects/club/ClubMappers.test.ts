import { describe, expect, it } from 'vitest';

import { mapClubMember } from '@/pages/objects/club';

describe('mapClubMember', () => {
  it('maps club member views using primary and affiliated club ids', () => {
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

  it('keeps primary club membership when affiliatedClubIds is empty', () => {
    const member = mapClubMember({
      playerId: 'player-2',
      userId: 'user-2',
      nickname: 'Bravo',
      registeredAt: '2026-01-01T00:00:00Z',
      currentRank: {
        platform: 'Custom',
        tier: 'Unranked',
      },
      status: 'Active',
      elo: 1400,
      clubId: 'club-z',
      affiliatedClubIds: [],
      roles: {
        isRegisteredPlayer: true,
        isClubAdmin: false,
        isTournamentAdmin: false,
        isSuperAdmin: false,
      },
      bannedReason: null,
    });

    expect(member.clubIds).toEqual(['club-z']);
  });
});
