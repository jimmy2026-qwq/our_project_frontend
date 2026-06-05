import { describe, expect, it } from 'vitest';

import {
  formatNumber,
  formatRelationList,
  getRelationLabel,
  getTournamentStatusLabel,
} from '@/pages/PublicClubDetailPage/functions/formatClubDetail';

describe('PublicClubDetail formatting', () => {
  it('formats numbers with zh-CN grouping', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('formats club relations without showing placeholder dashes', () => {
    expect(getRelationLabel('Alliance')).toBe('联盟');
    expect(getRelationLabel('Hostile')).toBe('对抗');
    expect(formatRelationList(['Alliance', 'Hostile'])).toBe('联盟 / 对抗');
    expect(formatRelationList([])).toBe('暂无关系');
  });

  it('maps tournament statuses to Chinese labels', () => {
    expect(getTournamentStatusLabel('Draft')).toBe('未发布');
    expect(getTournamentStatusLabel('RegistrationOpen')).toBe('报名中');
    expect(getTournamentStatusLabel('Scheduled')).toBe('已排期');
    expect(getTournamentStatusLabel('InProgress')).toBe('进行中');
    expect(getTournamentStatusLabel('Completed')).toBe('已完成');
    expect(getTournamentStatusLabel('Cancelled')).toBe('已取消');
    expect(getTournamentStatusLabel('Archived')).toBe('已归档');
    expect(getTournamentStatusLabel('')).toBe('');
  });
});
