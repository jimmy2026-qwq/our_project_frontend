import { describe, expect, it } from 'vitest';

import { mapClubMember } from './mappers';

describe('mapClubMember', () => {
  it('maps club member contracts using boundClubIds', () => {
    const member = mapClubMember({
      id: 'player-2',
      userId: 'user-2',
      nickname: 'Bravo',
      status: 'Banned',
      elo: 1400,
      boundClubIds: ['club-z'],
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
