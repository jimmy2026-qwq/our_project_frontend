import type { StageStatus, TournamentStatus } from '@/objects';
import { StageStatuses, TournamentStatuses } from '@/objects';
import { ClubRelationKinds } from '@/objects/club';
import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';

import type { PlayerLeaderboardEntry } from '../objects/PublicHallPage.types';
import { PublicHallLeaderboardDisplayStatuses } from '../objects/PublicHallLeaderboardDisplayStatus';

export const TOURNAMENT_STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value?: TournamentStatus;
  label: string;
}> = [
  { label: '全部赛事' },
  { value: TournamentStatuses.Draft, label: '未发布' },
  { value: TournamentStatuses.RegistrationOpen, label: '报名中' },
  { value: TournamentStatuses.Scheduled, label: '已排期' },
  { value: TournamentStatuses.InProgress, label: '进行中' },
  { value: TournamentStatuses.Completed, label: '已完成' },
  { value: TournamentStatuses.Cancelled, label: '已取消' },
  { value: TournamentStatuses.Archived, label: '已归档' },
];

export const STAGE_STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value?: StageStatus;
  label: string;
}> = [
  { label: '全部阶段' },
  { value: StageStatuses.Pending, label: '未开始' },
  { value: StageStatuses.Ready, label: '已就绪' },
  { value: StageStatuses.Active, label: '进行中' },
  { value: StageStatuses.Completed, label: '已完成' },
  { value: StageStatuses.Archived, label: '已归档' },
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

export function getTournamentStatusLabel(status: TournamentStatus) {
  return (
    TOURNAMENT_STATUS_FILTER_OPTIONS.find((option) => option.value === status)
      ?.label ?? status
  );
}

export function getStageStatusLabel(status: StageStatus) {
  return (
    STAGE_STATUS_FILTER_OPTIONS.find((option) => option.value === status)
      ?.label ?? status
  );
}

export function getRelationLabel(relation: ClubSummary['relations'][number]) {
  const relationKind =
    typeof relation === 'string' ? relation : relation.relation;
  return relationKind === ClubRelationKinds.Alliance ? '联盟' : '对抗';
}

export function formatRelationList(relations: ClubSummary['relations']) {
  return relations.map(getRelationLabel).join(' / ') || '暂无关系';
}

export function getLeaderboardStatusLabel(
  status: PlayerLeaderboardEntry['status'],
) {
  return (
    {
      [PublicHallLeaderboardDisplayStatuses.Active]: '活跃',
      [PublicHallLeaderboardDisplayStatuses.Inactive]: '未活跃',
      [PublicHallLeaderboardDisplayStatuses.Banned]: '封禁',
    } as const
  )[status];
}
