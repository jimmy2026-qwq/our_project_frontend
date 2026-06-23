import { StageStatus, TournamentStatuses, type TournamentStatus } from '@/objects';
import { ClubRelationKind } from '@/objects/club';
import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';

import type { PlayerLeaderboardEntry } from '../objects/leaderboard/PlayerLeaderboardEntry';

import { PublicHallLeaderboardDisplayStatus } from '@/pages/PublicHallPage/objects/PublicHallLeaderboardDisplayStatus';

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
  { value: StageStatus.Pending, label: '未开始' },
  { value: StageStatus.Ready, label: '已就绪' },
  { value: StageStatus.Active, label: '进行中' },
  { value: StageStatus.Completed, label: '已完成' },
  { value: StageStatus.Archived, label: '已归档' },
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
  return relationKind === ClubRelationKind.Alliance ? '联盟' : '对抗';
}

export function formatRelationList(relations: ClubSummary['relations']) {
  return relations.map(getRelationLabel).join(' / ') || '暂无关系';
}

export function getLeaderboardStatusLabel(
  status: PlayerLeaderboardEntry['status'],
) {
  const labels: Record<PublicHallLeaderboardDisplayStatus, string> = {
    [PublicHallLeaderboardDisplayStatus.Active]: '活跃',
    [PublicHallLeaderboardDisplayStatus.Inactive]: '未活跃',
    [PublicHallLeaderboardDisplayStatus.Banned]: '封禁',
  };

  return labels[status];
}
