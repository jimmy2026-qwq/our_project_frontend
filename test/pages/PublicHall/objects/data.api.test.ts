import { beforeEach, describe, expect, it, vi } from 'vitest';

const publicApiMock = vi.hoisted(() => ({
  getPublicClubProfile: vi.fn(),
  getPublicClubs: vi.fn(),
  getPublicPlayerLeaderboard: vi.fn(),
  getPublicSchedules: vi.fn(),
  getPublicTournamentProfile: vi.fn(),
}));

const tournamentApiMock = vi.hoisted(() => ({
  getTournament: vi.fn(),
  getTournaments: vi.fn(),
}));

const clubsApiMock = vi.hoisted(() => ({
  getClubTournaments: vi.fn(),
}));

vi.mock('@/pages/PublicHall/objects/data.transport', () => ({
  publicApi: publicApiMock,
  tournamentApi: tournamentApiMock,
  clubsApi: clubsApiMock,
}));

import { loadTournamentDetail } from '@/pages/PublicHall/objects/data.detail';
import { loadLeaderboard } from '@/pages/PublicHall/HomePage/objects/data.home.leaderboard';
import {
  loadManagedDraftSchedules,
  loadSchedules,
} from '@/pages/PublicHall/HomePage/objects/data.home.schedules';
import type {
  PublicHallState,
  PublicHallViewerContext,
} from '@/pages/PublicHall/objects/types';

function envelope<T>(items: T[], offset = 0) {
  return {
    items,
    total: items.length,
    limit: 20,
    offset,
    hasMore: false,
    appliedFilters: {},
  };
}

const baseState: PublicHallState = {
  activeView: 'schedules',
  scheduleTournamentStatus: '',
  scheduleStageStatus: '',
  leaderboardClubId: '',
  leaderboardStatus: '',
  clubActiveOnly: true,
};

describe('public-hall data api integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('loads public schedules with backend filter names', async () => {
    publicApiMock.getPublicSchedules.mockResolvedValueOnce(
      envelope([
        {
          tournamentId: 'tournament-1',
          tournamentName: 'Spring Cup',
          tournamentStatus: 'InProgress',
          stageId: 'stage-1',
          stageName: 'Qualifier',
          stageStatus: 'Active',
          scheduledAt: '2026-05-21T10:00:00Z',
        },
      ]),
    );

    const result = await loadSchedules({
      ...baseState,
      scheduleTournamentStatus: 'InProgress',
      scheduleStageStatus: 'Active',
    });

    expect(publicApiMock.getPublicSchedules).toHaveBeenCalledWith({
      tournamentStatus: 'InProgress',
      stageStatus: 'Active',
    });
    expect(result).toMatchObject({
      source: 'api',
      envelope: { items: [{ tournamentId: 'tournament-1' }] },
    });
  });

  it('builds unpublished draft schedules from tournament admin detail responses', async () => {
    const context: PublicHallViewerContext = {
      session: {
        token: 'token-1',
        user: {
          userId: 'user-1',
          username: 'admin',
          displayName: 'Admin',
          operatorId: 'player-1',
          roles: {
            isGuest: false,
            isRegisteredPlayer: true,
            isClubAdmin: false,
            isTournamentAdmin: true,
            isSuperAdmin: false,
          },
        },
      },
    };
    tournamentApiMock.getTournaments.mockResolvedValueOnce(
      envelope([{ id: 'tournament-1', name: 'Draft Cup' }]),
    );
    tournamentApiMock.getTournament.mockResolvedValueOnce({
      tournamentId: 'tournament-1',
      name: 'Draft Cup',
      status: 'Draft',
      startsAt: '2026-05-21T10:00:00Z',
      stages: [
        {
          stageId: 'stage-1',
          name: 'Qualifier',
          status: 'Ready',
          roundCount: 3,
          scheduledTableCount: 0,
          pendingTablePlanCount: 2,
        },
      ],
    });

    const result = await loadManagedDraftSchedules(context);

    expect(tournamentApiMock.getTournaments).toHaveBeenCalledWith({
      adminId: 'player-1',
      status: 'Draft',
      limit: 50,
      offset: 0,
    });
    expect(result).toEqual([
      {
        tournamentId: 'tournament-1',
        tournamentName: 'Draft Cup',
        tournamentStatus: 'Draft',
        stageId: 'stage-1',
        stageName: 'Qualifier',
        stageStatus: 'Pending',
        scheduledAt: '2026-05-21T10:00:00Z',
        isUnpublished: true,
      },
    ]);
  });

  it('maps backend leaderboard entries into page rows with club names and ranks', async () => {
    publicApiMock.getPublicPlayerLeaderboard.mockResolvedValueOnce({
      ...envelope(
        [
          {
            playerId: 'player-1',
            nickname: 'East Wind',
            clubIds: ['club-1', 'club-missing'],
            elo: 1820,
            currentRank: { platform: 'MahjongSoul', tier: 'Master', stars: 2 },
            normalizedRankScore: 920,
            status: 'Suspended',
          },
        ],
        10,
      ),
      offset: 10,
    });

    const result = await loadLeaderboard(
      {
        ...baseState,
        leaderboardClubId: 'club-1',
        leaderboardStatus: 'Active',
      },
      {
        source: 'api',
        envelope: envelope([
          {
            id: 'club-1',
            name: 'Riichi Lab',
            memberCount: 12,
            powerRating: 2200,
            treasury: 100,
            relations: [],
          },
        ]),
      },
    );

    expect(publicApiMock.getPublicPlayerLeaderboard).toHaveBeenCalledWith({
      clubId: 'club-1',
      status: 'Active',
    });
    expect(result.envelope.items[0]).toMatchObject({
      playerId: 'player-1',
      clubName: 'Riichi Lab / club-missing',
      rank: 11,
      currentRank: 'MahjongSoul Master 2',
      status: 'Inactive',
    });
  });

  it('falls back to admin tournament detail when public detail rejects draft tournaments', async () => {
    publicApiMock.getPublicTournamentProfile.mockRejectedValueOnce(
      new Error('not public'),
    );
    tournamentApiMock.getTournament.mockResolvedValueOnce({
      tournamentId: 'tournament-draft',
      name: 'Draft Cup',
      organizer: 'QA Club',
      status: 'Draft',
      startsAt: '2026-05-21T10:00:00Z',
      endsAt: '2026-05-21T18:00:00Z',
      participatingClubs: [{ clubId: 'club-1', memberCount: 4 }],
      participatingPlayers: [],
      whitelistSummary: {
        clubIds: ['club-1'],
        playerIds: [],
        totalEntries: 1,
        clubCount: 1,
        playerCount: 0,
      },
      stages: [],
    });

    const result = await loadTournamentDetail('tournament-draft');

    expect(publicApiMock.getPublicTournamentProfile).toHaveBeenCalledWith(
      'tournament-draft',
    );
    expect(tournamentApiMock.getTournament).toHaveBeenCalledWith(
      'tournament-draft',
    );
    expect(result).toMatchObject({
      source: 'api',
      warning:
        'This tournament is still in draft mode and is shown through the admin endpoint.',
      item: {
        id: 'tournament-draft',
        name: 'Draft Cup',
        whitelistType: 'Club',
      },
    });
  });
});
