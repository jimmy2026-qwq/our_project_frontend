import { describe, expect, it } from 'vitest';

import {
  buildFallbackDirectory,
  createMemberHubState,
  normalizeClubIdForOperator,
  toApplicationView,
  uniqueById,
  type MemberHubOperatorDirectory,
  type MemberHubState,
} from './data.shared';

describe('member-hub data.shared', () => {
  it('buildFallbackDirectory exposes the current registered player as the active operator', () => {
    const directory = buildFallbackDirectory({
      token: 'token',
      user: {
        userId: 'user-1',
        username: 'alpha',
        displayName: 'Alpha',
        operatorId: 'player-1',
        roles: {
          isGuest: false,
          isRegisteredPlayer: true,
          isClubAdmin: false,
          isTournamentAdmin: false,
          isSuperAdmin: false,
        },
      },
    });

    expect(directory).toEqual({
      items: [
        {
          id: 'player-1',
          label: 'Alpha / Registered Player',
          role: 'RegisteredPlayer',
          playerId: 'player-1',
          managedClubIds: [],
        },
      ],
      clubsById: {},
      source: 'api',
    });
  });

  it('createMemberHubState prefers the requested operator and its first managed club', () => {
    const directory: MemberHubOperatorDirectory = {
      source: 'api',
      items: [
        {
          id: 'player-a',
          label: 'Alpha',
          role: 'RegisteredPlayer',
          playerId: 'player-a',
          managedClubIds: [],
        },
        {
          id: 'player-b',
          label: 'Bravo',
          role: 'ClubAdmin',
          playerId: 'player-b',
          managedClubIds: ['club-2', 'club-3'],
        },
      ],
      clubsById: {
        'club-1': {
          id: 'club-1',
          name: 'Fallback Club',
          memberCount: 4,
          powerRating: 1200,
          treasury: 0,
          relations: [],
        },
        'club-2': {
          id: 'club-2',
          name: 'Managed Club',
          memberCount: 8,
          powerRating: 1600,
          treasury: 100,
          relations: [],
        },
      },
    };

    expect(createMemberHubState(directory, 'player-b')).toEqual({
      operatorId: 'player-b',
      playerId: 'player-b',
      clubId: 'club-2',
    });
  });

  it('normalizeClubIdForOperator falls back to the first managed club when the selected club is not manageable', () => {
    const directory: MemberHubOperatorDirectory = {
      source: 'api',
      items: [
        {
          id: 'player-admin',
          label: 'Admin',
          role: 'ClubAdmin',
          playerId: 'player-admin',
          managedClubIds: ['club-10', 'club-11'],
        },
      ],
      clubsById: {
        'club-10': {
          id: 'club-10',
          name: 'Ten',
          memberCount: 6,
          powerRating: 1500,
          treasury: 0,
          relations: [],
        },
        'club-11': {
          id: 'club-11',
          name: 'Eleven',
          memberCount: 5,
          powerRating: 1400,
          treasury: 0,
          relations: [],
        },
      },
    };
    const state: MemberHubState = {
      operatorId: 'player-admin',
      playerId: 'player-admin',
      clubId: 'club-99',
    };

    expect(normalizeClubIdForOperator(directory, state)).toBe('club-10');
  });

  it('toApplicationView marks only pending applications as reviewable', () => {
    const pending = toApplicationView({
      id: 'application-1',
      clubId: 'club-1',
      clubName: 'Club One',
      operatorId: 'player-9',
      applicantName: 'Applicant',
      submittedAt: '2026-05-11T00:00:00Z',
      message: 'hello',
      status: 'Pending',
      source: 'api',
    });
    const approved = toApplicationView({
      id: 'application-2',
      clubId: 'club-1',
      clubName: 'Club One',
      operatorId: 'player-9',
      applicantName: 'Applicant',
      submittedAt: '2026-05-11T00:00:00Z',
      message: 'hello',
      status: 'Approved',
      source: 'api',
    });

    expect(pending.canReview).toBe(true);
    expect(approved.canReview).toBe(false);
  });

  it('uniqueById keeps the first occurrence of each operator id', () => {
    const result = uniqueById([
      {
        id: 'player-1',
        label: 'Alpha',
        role: 'RegisteredPlayer',
        playerId: 'player-1',
        managedClubIds: [],
      },
      {
        id: 'player-1',
        label: 'Alpha Duplicate',
        role: 'ClubAdmin',
        playerId: 'player-1',
        managedClubIds: ['club-1'],
      },
      {
        id: 'player-2',
        label: 'Bravo',
        role: 'ClubAdmin',
        playerId: 'player-2',
        managedClubIds: ['club-2'],
      },
    ]);

    expect(result).toEqual([
      {
        id: 'player-1',
        label: 'Alpha',
        role: 'RegisteredPlayer',
        playerId: 'player-1',
        managedClubIds: [],
      },
      {
        id: 'player-2',
        label: 'Bravo',
        role: 'ClubAdmin',
        playerId: 'player-2',
        managedClubIds: ['club-2'],
      },
    ]);
  });
});
