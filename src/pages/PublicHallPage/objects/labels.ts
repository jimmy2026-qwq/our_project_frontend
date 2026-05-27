import type {
  StageStatus,
  TournamentStatus,
} from '@/objects';
import type { ClubSummary } from '@/pages/objects/club';

import type { PlayerLeaderboardEntry } from './types';

export const TOURNAMENT_STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value: TournamentStatus | '';
  label: string;
}> = [
  { value: '', label: '全部赛事' },
  { value: 'Draft', label: '未发布' },
  { value: 'RegistrationOpen', label: '报名中' },
  { value: 'Scheduled', label: '已排期' },
  { value: 'InProgress', label: '进行中' },
  { value: 'Completed', label: '已完成' },
  { value: 'Cancelled', label: '已取消' },
  { value: 'Archived', label: '已归档' },
];

export const STAGE_STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value: StageStatus | '';
  label: string;
}> = [
  { value: '', label: '全部阶段' },
  { value: 'Pending', label: '未开始' },
  { value: 'Ready', label: '已就绪' },
  { value: 'Active', label: '进行中' },
  { value: 'Completed', label: '已完成' },
  { value: 'Archived', label: '已归档' },
];

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value);
}

export function getTournamentStatusLabel(status: TournamentStatus | '') {
  return (
    TOURNAMENT_STATUS_FILTER_OPTIONS.find((option) => option.value === status)
      ?.label ?? status
  );
}

export function getStageStatusLabel(status: StageStatus | '') {
  return (
    STAGE_STATUS_FILTER_OPTIONS.find((option) => option.value === status)
      ?.label ?? status
  );
}

export function getRelationLabel(relation: ClubSummary['relations'][number]) {
  return relation === 'Alliance' ? '联盟' : '对抗';
}

export function getLeaderboardStatusLabel(
  status: PlayerLeaderboardEntry['status'] | '',
) {
  return (
    {
      '': '全部玩家',
      Active: '活跃',
      Inactive: '未活跃',
      Banned: '封禁',
    } as const
  )[status];
}
