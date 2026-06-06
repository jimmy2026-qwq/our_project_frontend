import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createProvisionalClubApplicationId,
  isProvisionalClubApplicationId,
  readTrackedClubApplication,
  readTrackedClubApplicationsByPlayer,
  updateTrackedClubApplicationStatus,
  upsertTrackedClubApplication,
} from '@/pages/PublicClubDetailPage/functions/getClubApplicationTracker';

function createLocalStorageMock() {
  const store = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
  };
}

describe('club application tracker', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      localStorage: createLocalStorageMock(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates and recognizes provisional application ids', () => {
    const id = createProvisionalClubApplicationId('club-1', 'player-1');

    expect(id).toBe('pending:club-1:player-1');
    expect(isProvisionalClubApplicationId(id)).toBe(true);
    expect(isProvisionalClubApplicationId('application-1')).toBe(false);
  });

  it('replaces provisional application records with real backend records', () => {
    const provisional = {
      id: createProvisionalClubApplicationId('club-1', 'player-1'),
      clubId: 'club-1',
      clubName: 'Test Club',
      playerId: 'player-1',
      applicantName: 'Larry',
      message: '申请加入',
      status: 'Pending' as const,
      submittedAt: '2026-06-05T00:00:00Z',
      source: 'local' as const,
    };
    const real = {
      ...provisional,
      id: 'application-1',
      source: 'api' as const,
    };

    upsertTrackedClubApplication(provisional);
    upsertTrackedClubApplication(real);

    expect(readTrackedClubApplication(provisional.id)).toBeNull();
    expect(readTrackedClubApplication('application-1')).toEqual(real);
    expect(readTrackedClubApplicationsByPlayer('player-1')).toEqual([real]);
  });

  it('updates tracked application status in place', () => {
    upsertTrackedClubApplication({
      id: 'application-1',
      clubId: 'club-1',
      clubName: 'Test Club',
      playerId: 'player-1',
      applicantName: 'Larry',
      message: '申请加入',
      status: 'Pending',
      submittedAt: '2026-06-05T00:00:00Z',
      source: 'api',
    });

    updateTrackedClubApplicationStatus('application-1', 'Approved');

    expect(readTrackedClubApplication('application-1')).toMatchObject({
      status: 'Approved',
    });
  });

  it('returns empty results when storage is unavailable or malformed', () => {
    vi.unstubAllGlobals();

    expect(readTrackedClubApplication('application-1')).toBeNull();
    expect(readTrackedClubApplicationsByPlayer('player-1')).toEqual([]);
    expect(() => upsertTrackedClubApplication(createTrackedApplication())).not.toThrow();

    vi.stubGlobal('window', {
      localStorage: createLocalStorageMock(),
    });
    window.localStorage.setItem(
      'riichi-nexus.club-application-tracker',
      '{not-json',
    );

    expect(readTrackedClubApplicationsByPlayer('player-1')).toEqual([]);
  });

  it('normalizes legacy operator ids and drops invalid stored records', () => {
    window.localStorage.setItem(
      'riichi-nexus.club-application-tracker',
      JSON.stringify([
        {
          id: 'legacy-application',
          clubId: 'club-1',
          clubName: 'Legacy Club',
          operatorId: 'legacy-player',
          applicantName: 'Old Larry',
          message: 'legacy request',
          status: 'Pending',
          submittedAt: '2026-06-05T00:00:00Z',
          source: 'api',
        },
        {
          id: 'bad-application',
          clubId: 'club-1',
          clubName: 'Bad Club',
          applicantName: 'Missing Player',
          message: 'bad request',
          status: 'Pending',
          submittedAt: '2026-06-05T00:00:00Z',
          source: 'api',
        },
        null,
      ]),
    );

    expect(readTrackedClubApplicationsByPlayer('legacy-player')).toEqual([
      {
        applicantName: 'Old Larry',
        clubId: 'club-1',
        clubName: 'Legacy Club',
        id: 'legacy-application',
        message: 'legacy request',
        playerId: 'legacy-player',
        source: 'api',
        status: 'Pending',
        submittedAt: '2026-06-05T00:00:00Z',
      },
    ]);
  });

  it('keeps backend records when a later provisional record targets the same club and player', () => {
    const real = createTrackedApplication({ id: 'application-1', source: 'api' });
    const provisional = createTrackedApplication({
      id: createProvisionalClubApplicationId('club-1', 'player-1'),
      source: 'local',
      submittedAt: '2026-06-06T00:00:00Z',
    });

    upsertTrackedClubApplication(real);
    upsertTrackedClubApplication(provisional);

    expect(readTrackedClubApplicationsByPlayer('player-1')).toEqual([
      provisional,
      real,
    ]);
  });

  it('caps stored application history to the latest twenty records', () => {
    Array.from({ length: 22 }, (_, index) => index).forEach((index) => {
      upsertTrackedClubApplication(
        createTrackedApplication({
          clubId: `club-${index}`,
          id: `application-${index}`,
          submittedAt: `2026-06-${String(index + 1).padStart(2, '0')}T00:00:00Z`,
        }),
      );
    });

    const tracked = readTrackedClubApplicationsByPlayer('player-1');

    expect(tracked).toHaveLength(20);
    expect(tracked[0].id).toBe('application-21');
    expect(tracked.at(-1)?.id).toBe('application-2');
  });
});

function createTrackedApplication(
  patch: Partial<Parameters<typeof upsertTrackedClubApplication>[0]> = {},
): Parameters<typeof upsertTrackedClubApplication>[0] {
  return {
    id: 'application-1',
    clubId: 'club-1',
    clubName: 'Test Club',
    playerId: 'player-1',
    applicantName: 'Larry',
    message: '申请加入',
    status: 'Pending',
    submittedAt: '2026-06-05T00:00:00Z',
    source: 'api',
    ...patch,
  };
}
