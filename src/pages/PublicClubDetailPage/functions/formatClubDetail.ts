import type { TournamentStatus } from '@/objects';
import type { ClubSummary } from '@/pages/objects/ClubSummary';

const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  Draft: '未发布',
  RegistrationOpen: '报名中',
  Scheduled: '已排期',
  InProgress: '进行中',
  Completed: '已完成',
  Cancelled: '已取消',
  Archived: '已归档',
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
  return relationKind === 'Alliance' ? '联盟' : '对抗';
}

export function formatRelationList(relations: ClubSummary['relations']) {
  return relations.map(getRelationLabel).join(' / ') || '暂无关系';
}

export function getTournamentStatusLabel(status: TournamentStatus | '') {
  return status ? (TOURNAMENT_STATUS_LABELS[status] ?? status) : status;
}
