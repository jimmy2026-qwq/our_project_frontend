import { TournamentStatuses, type TournamentStatus } from '@/objects';
import { ClubRelationKinds } from '@/objects/club';
import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';

const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  [TournamentStatuses.Draft]: '未发布',
  [TournamentStatuses.RegistrationOpen]: '报名中',
  [TournamentStatuses.Scheduled]: '已排期',
  [TournamentStatuses.InProgress]: '进行中',
  [TournamentStatuses.Completed]: '已完成',
  [TournamentStatuses.Cancelled]: '已取消',
  [TournamentStatuses.Archived]: '已归档',
};

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('zh-CN').format(value);
}

export function getRelationLabel(relation: ClubSummary['relations'][number]) {
  const relationKind =
    typeof relation === 'string' ? relation : relation.relation;
  return relationKind === ClubRelationKinds.Alliance ? '联盟' : '对抗';
}

export function formatRelationList(relations: ClubSummary['relations']) {
  return relations.map(getRelationLabel).join(' / ') || '暂无关系';
}

export function getTournamentStatusLabel(status: TournamentStatus) {
  return TOURNAMENT_STATUS_LABELS[status] ?? status;
}
