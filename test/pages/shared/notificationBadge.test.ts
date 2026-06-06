import { describe, expect, it } from 'vitest';

import {
  getNotificationBadgeLabel,
  getNotificationBadgeVariant,
} from '@/notifications/functions/getNotificationBadge';
import type { Notification } from '@/objects/notification';

describe('getNotificationBadgeLabel', () => {
  it('labels tournament table start notifications as tournament notifications', () => {
    expect(
      getNotificationBadgeLabel(
        createNotification({ notificationType: 'TournamentTableStarted' }),
      ),
    ).toBe('\u8d5b\u4e8b');
  });

  it('labels club, application, ELO and unknown notifications', () => {
    expect(
      getNotificationBadgeLabel(
        createNotification({ notificationType: 'ClubApplicationSubmitted' }),
      ),
    ).toBe('申请');
    expect(
      getNotificationBadgeLabel(
        createNotification({ notificationType: 'ClubApplicationApproved' }),
      ),
    ).toBe('申请结果');
    expect(
      getNotificationBadgeLabel(
        createNotification({ notificationType: 'ClubTitleAssigned' }),
      ),
    ).toBe('俱乐部');
    expect(
      getNotificationBadgeLabel(
        createNotification({ notificationType: 'PlayerEloChanged' }),
      ),
    ).toBe('ELO');
    expect(
      getNotificationBadgeLabel(
        createNotification({
          notificationType: 'Unknown',
          severity: 'warning',
        }),
      ),
    ).toBe('提醒');
  });

  it('maps badge variants from severity while rejected applications stay outlined', () => {
    expect(
      getNotificationBadgeVariant(
        createNotification({ notificationType: 'ClubApplicationRejected' }),
      ),
    ).toBe('outline');
    expect(getNotificationBadgeVariant(createNotification({ severity: 'success' }))).toBe('success');
    expect(getNotificationBadgeVariant(createNotification({ severity: 'warning' }))).toBe('warning');
    expect(getNotificationBadgeVariant(createNotification({ severity: 'danger' }))).toBe('danger');
    expect(getNotificationBadgeVariant(createNotification({ severity: 'error' }))).toBe('danger');
    expect(getNotificationBadgeVariant(createNotification({ severity: 'info' }))).toBe('outline');
  });
});

function createNotification(
  overrides: Partial<Notification> = {},
): Notification {
  return {
    id: 'notification-1',
    recipientPlayerId: 'player-east',
    notificationType: 'TournamentTableStarted',
    title: '\u8d5b\u4e8b\u724c\u684c\u5df2\u5f00\u59cb',
    body: '\u6d4b\u8bd5\u8d5b / \u4e88\u8d5b \u7684\u7b2c 1 \u684c\u5df2\u7ecf\u5f00\u59cb\u3002',
    severity: 'info',
    sourceService: 'tournament',
    sourceType: 'tournament-table',
    sourceId: 'table-1',
    actionUrl: '/tables/table-1',
    createdAt: '2026-06-05T00:00:00Z',
    objects: {},
    ...overrides,
  };
}
