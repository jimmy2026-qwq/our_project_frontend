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
});
