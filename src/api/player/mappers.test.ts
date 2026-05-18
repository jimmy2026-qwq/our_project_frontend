import { describe, expect, it } from 'vitest';

import { mapPlayerProfile } from './mappers';

describe('mapPlayerProfile', () => {
  it('maps backend player contracts using boundClubIds as the single source of club membership', () => {
    const profile = mapPlayerProfile({
      id: 'player-1',
      userId: 'user-1',
      nickname: 'Alpha',
      status: 'Active',
      elo: 1725,
      boundClubIds: ['club-a', 'club-b'],
    });

    expect(profile).toEqual({
      playerId: 'player-1',
      applicantUserId: 'user-1',
      displayName: 'Alpha',
      playerStatus: 'Active',
      elo: 1725,
      clubIds: ['club-a', 'club-b'],
    });
  });
});
