import type {
  StageStatus,
  TournamentStatus,
} from '@/objects';

const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  Draft: '未发布',
  RegistrationOpen: '报名中',
  Scheduled: '已排期',
  InProgress: '进行中',
  Completed: '已完成',
  Cancelled: '已取消',
  Archived: '已归档',
};

const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  Pending: '未开始',
  Ready: '已就绪',
  Active: '进行中',
  Completed: '已完成',
  Archived: '已归档',
};

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getTournamentStatusLabel(status: TournamentStatus | '') {
  return status ? TOURNAMENT_STATUS_LABELS[status] ?? status : status;
}

export function getStageStatusLabel(status: StageStatus | '') {
  return status ? STAGE_STATUS_LABELS[status] ?? status : status;
}
