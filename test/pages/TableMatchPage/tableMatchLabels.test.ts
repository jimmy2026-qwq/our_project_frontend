import { describe, expect, it } from 'vitest';

import {
  getAppealButtonText,
  getSeatStatusLabel,
  getSeatStatusTone,
  getTableStatusLabel,
  matchBackLinkClassName,
} from '@/pages/TableMatchPage/objects/TableMatch.labels';

describe('TableMatch labels', () => {
  it('maps table statuses to Chinese labels and preserves unknown statuses', () => {
    expect(getTableStatusLabel('WaitingPreparation')).toBe('等待准备');
    expect(getTableStatusLabel('InProgress')).toBe('进行中');
    expect(getTableStatusLabel('Scoring')).toBe('等待申诉');
    expect(getTableStatusLabel('AppealInProgress')).toBe('申诉处理中');
    expect(getTableStatusLabel('Archived')).toBe('已归档');
    expect(getTableStatusLabel('CustomStatus' as never)).toBe('CustomStatus');
  });

  it('prioritizes disconnected seat state over ready state', () => {
    expect(getSeatStatusTone({ ready: true, disconnected: true })).toBe('danger');
    expect(getSeatStatusLabel({ ready: true, disconnected: true })).toBe('已断线');
    expect(getSeatStatusTone({ ready: true, disconnected: false })).toBe('success');
    expect(getSeatStatusLabel({ ready: true, disconnected: false })).toBe('已准备');
    expect(getSeatStatusTone({ ready: false, disconnected: false })).toBe('warning');
    expect(getSeatStatusLabel({ ready: false, disconnected: false })).toBe('待准备');
  });

  it('uses a distinct appeal label only while an appeal is active', () => {
    expect(getAppealButtonText('AppealInProgress')).toBe('申诉处理中');
    expect(getAppealButtonText('InProgress')).toBe('发起赛事申诉');
  });

  it('keeps the back link class as an inline-flex link control', () => {
    expect(matchBackLinkClassName()).toContain('inline-flex');
    expect(matchBackLinkClassName()).toContain('no-underline');
  });
});
