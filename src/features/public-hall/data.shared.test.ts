import { describe, expect, it } from 'vitest';

import {
  formatRankLabel,
  mapAdminStageStatus,
  mapLeaderboardStatus,
  mapTournamentDetailFromAdminView,
} from './data.shared';

describe('public-hall data.shared', () => {
  it('maps suspended leaderboard status to the public inactive state', () => {
    expect(mapLeaderboardStatus('Suspended')).toBe('Inactive');
    expect(mapLeaderboardStatus('Active')).toBe('Active');
  });

  it('formats rank labels with and without stars', () => {
    expect(formatRankLabel({ platform: 'Tenhou', tier: '5-dan' })).toBe(
      'Tenhou 5-dan',
    );
    expect(
      formatRankLabel({ platform: 'MahjongSoul', tier: 'Master', stars: 2 }),
    ).toBe('MahjongSoul Master 2');
    expect(formatRankLabel(null)).toBeNull();
  });

  it('maps admin stage statuses to the public tournament detail stage status set', () => {
    expect(mapAdminStageStatus('Active')).toBe('Active');
    expect(mapAdminStageStatus('Completed')).toBe('Completed');
    expect(mapAdminStageStatus('Ready')).toBe('Pending');
    expect(mapAdminStageStatus(undefined)).toBe('Pending');
  });

  it('maps admin tournament detail views into public tournament profiles', () => {
    const profile = mapTournamentDetailFromAdminView({
      tournamentId: 'tournament-1',
      name: 'Spring Cup',
      organizer: 'QA Club',
      status: 'InProgress',
      startsAt: '2026-05-11T10:00:00Z',
      endsAt: '2026-05-11T18:00:00Z',
      participatingClubs: [
        {
          clubId: 'club-1',
          clubName: 'Club One',
          memberCount: 4,
          activeMemberCount: 4,
        },
      ],
      participatingPlayers: [{ playerId: 'player-1' }],
      whitelistSummary: {
        clubIds: ['club-1'],
        playerIds: ['player-1'],
        totalEntries: 2,
        clubCount: 1,
        playerCount: 1,
      },
      stages: [
        {
          stageId: 'stage-1',
          name: 'Qualifier',
          status: 'Active',
          roundCount: 3,
          scheduledTableCount: 2,
          pendingTablePlanCount: 1,
          lineupSubmissions: [
            {
              submissionId: 'submission-1',
              clubId: 'club-1',
              clubName: 'Club One',
              submittedBy: 'player-1',
              submittedByDisplayName: 'Alpha',
              submittedAt: '2026-05-11T09:00:00Z',
              activePlayerIds: ['player-1', 'player-2', 'player-3', 'player-4'],
              reservePlayerIds: ['player-5'],
              note: 'ready',
            },
          ],
        },
      ],
    });

    expect(profile.id).toBe('tournament-1');
    expect(profile.whitelistType).toBe('Mixed');
    expect(profile.clubIds).toEqual(['club-1']);
    expect(profile.playerCount).toBe(1);
    expect(profile.nextStageStatus).toBe('Active');
    expect(profile.stages?.[0]).toMatchObject({
      stageId: 'stage-1',
      name: 'Qualifier',
      status: 'Active',
      roundCount: 3,
      tableCount: 2,
      pendingTablePlanCount: 1,
    });
    expect(profile.stages?.[0]?.lineupSubmissions?.[0]).toMatchObject({
      submissionId: 'submission-1',
      clubId: 'club-1',
      clubName: 'Club One',
      submittedByDisplayName: 'Alpha',
      note: 'ready',
    });
  });
});
