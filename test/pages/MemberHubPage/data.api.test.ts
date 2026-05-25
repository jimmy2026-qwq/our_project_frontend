import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendAPIMock = vi.hoisted(() => vi.fn());

const inboxStoreMock = vi.hoisted(() => ({
  readClubApplicationInbox: vi.fn(),
  upsertClubApplicationInboxItem: vi.fn(),
}));

vi.mock('@/system/api', () => ({
  APIMessage: class {},
  sendAPI: sendAPIMock,
}));

vi.mock('@/pages/objects/club/ClubApplicationInbox', () => inboxStoreMock);

import type { AuthSession } from '@/providers/auth/AuthSession';
import { loadClubDashboard, loadPlayerDashboard } from '@/pages/MemberHubPage/objects/data.dashboard';
import { loadMemberHubOperatorDirectory } from '@/pages/MemberHubPage/objects/data.directory';
import { loadClubApplicationInbox } from '@/pages/MemberHubPage/objects/data.inbox';

function envelope<T>(items: T[]) {
  return {
    items,
    total: items.length,
    limit: 20,
    offset: 0,
    hasMore: false,
    appliedFilters: {},
  };
}

const registeredSession: AuthSession = {
  token: 'token-1',
  user: {
    userId: 'user-1',
    username: 'east-wind',
    displayName: 'East Wind',
    operatorId: 'player-1',
    roles: {
      isGuest: false,
      isRegisteredPlayer: true,
      isClubAdmin: true,
      isTournamentAdmin: false,
      isSuperAdmin: false,
    },
  },
};

describe('member-hub data api integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads the current operator directory from managed clubs', async () => {
    sendAPIMock.mockResolvedValueOnce(
      envelope([
        {
          id: 'club-1',
          name: 'Riichi Lab',
          members: Array.from({ length: 12 }, (_, index) => `player-${index}`),
          powerRating: 2200,
          treasuryBalance: 100,
          relations: [],
        },
      ]),
    );

    const result = await loadMemberHubOperatorDirectory(registeredSession);

    expect(sendAPIMock).toHaveBeenCalledOnce();
    expect(sendAPIMock.mock.calls[0][0]).toMatchObject({
      query: {
        adminId: 'player-1',
        activeOnly: true,
        limit: 20,
        offset: 0,
      },
    });
    expect(result).toMatchObject({
      source: 'api',
      items: [
        {
          id: 'player-1',
          role: 'ClubAdmin',
          managedClubIds: ['club-1'],
        },
      ],
      clubsById: {
        'club-1': { name: 'Riichi Lab' },
      },
    });
  });

  it('loads pending club applications with backend list filters for club admins', async () => {
    sendAPIMock.mockResolvedValueOnce(
      envelope([
        {
          applicationId: 'application-1',
          clubId: 'club-1',
          clubName: 'Riichi Lab',
          applicant: { displayName: 'Applicant', clubIds: [] },
          submittedAt: '2026-05-21T10:00:00Z',
          status: 'Pending',
          canReview: true,
          canWithdraw: false,
        },
      ]),
    );

    const result = await loadClubApplicationInbox(
      'club-1',
      'player-1',
      'ClubAdmin',
    );

    expect(sendAPIMock).toHaveBeenCalledOnce();
    expect(sendAPIMock.mock.calls[0][0]).toMatchObject({
      clubId: 'club-1',
      query: {
        operatorId: 'player-1',
        status: 'Pending',
        limit: 20,
        offset: 0,
      },
    });
    expect(result).toMatchObject({
      source: 'api',
      items: [{ applicationId: 'application-1', status: 'Pending' }],
    });
  });

  it('does not call the backend inbox endpoint for non club-admin roles', async () => {
    await expect(
      loadClubApplicationInbox('club-1', 'player-1', 'RegisteredPlayer'),
    ).resolves.toEqual({
      items: [],
      source: 'api',
    });

    expect(sendAPIMock).not.toHaveBeenCalled();
  });

  it('wraps dashboard API failures into nullable load states', async () => {
    sendAPIMock
      .mockRejectedValueOnce(new Error('dashboard unavailable'))
      .mockResolvedValueOnce({
        owner: 'club:club-1',
        sampleSize: 12,
        winRate: 0.25,
        averagePlacement: 2.35,
        riichiRate: 0.42,
        lastUpdatedAt: '2026-05-21T10:00:00Z',
      });

    await expect(loadPlayerDashboard('player-1', 'operator-1')).resolves.toEqual(
      {
        dashboard: null,
        source: 'api',
        warning: 'dashboard unavailable',
      },
    );
    await expect(loadClubDashboard('club-1', 'operator-1')).resolves.toMatchObject(
      {
        source: 'api',
        dashboard: { ownerId: 'club-1', ownerType: 'club' },
      },
    );

    expect(sendAPIMock.mock.calls[0][0]).toMatchObject({
      playerId: 'player-1',
      operatorId: 'operator-1',
    });
    expect(sendAPIMock.mock.calls[1][0]).toMatchObject({
      clubId: 'club-1',
      operatorId: 'operator-1',
    });
  });
});
