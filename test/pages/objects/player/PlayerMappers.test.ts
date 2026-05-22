import { describe, expect, it } from 'vitest';

import { mapPlayerProfile } from '@/pages/objects/player';

describe('mapPlayerProfile', () => {
  it('maps backend player contracts using primary and affiliated club ids', () => {
    const profile = mapPlayerProfile({
      playerId: 'player-1',
      userId: 'user-1',
      nickname: 'Alpha',
      registeredAt: '2026-03-29T09:00:00Z',
      currentRank: {
        platform: 'Tenhou',
        tier: '4-dan',
        stars: null,
      },
      status: 'Active',
      elo: 1725,
      clubId: 'club-a',
      affiliatedClubIds: ['club-a', 'club-b'],
      roles: {
        isRegisteredPlayer: true,
        isClubAdmin: false,
        isTournamentAdmin: false,
        isSuperAdmin: false,
      },
      bannedReason: null,
    });

    expect(profile).toEqual({
      playerId: 'player-1',
      applicantUserId: 'user-1',
      displayName: 'Alpha',
      playerStatus: 'Active',
      currentRank: {
        platform: 'Tenhou',
        tier: '4-dan',
        stars: null,
      },
      elo: 1725,
      clubIds: ['club-a', 'club-b'],
    });
  });

  it('keeps primary club membership when affiliatedClubIds is empty', () => {
    const profile = mapPlayerProfile({
      playerId: 'player-77d657ec',
      userId: 'user-77d657ec',
      nickname: 'Club Player',
      registeredAt: '2026-03-29T09:00:00Z',
      currentRank: {
        platform: 'Tenhou',
        tier: '4-dan',
        stars: null,
      },
      status: 'Active',
      elo: 1725,
      clubId: 'club-primary',
      affiliatedClubIds: [],
      roles: {
        isRegisteredPlayer: true,
        isClubAdmin: false,
        isTournamentAdmin: false,
        isSuperAdmin: false,
      },
      bannedReason: null,
    });

    expect(profile.clubIds).toEqual(['club-primary']);
  });
});
