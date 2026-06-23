import { StageStatus, TournamentStatuses, type TournamentStatus } from '@/objects';

const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  [TournamentStatuses.Draft]: '未发布',
  [TournamentStatuses.RegistrationOpen]: '报名中',
  [TournamentStatuses.Scheduled]: '已排期',
  [TournamentStatuses.InProgress]: '进行中',
  [TournamentStatuses.Completed]: '已完成',
  [TournamentStatuses.Cancelled]: '已取消',
  [TournamentStatuses.Archived]: '已归档',
};

const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  [StageStatus.Pending]: '未开始',
  [StageStatus.Ready]: '已就绪',
  [StageStatus.Active]: '进行中',
  [StageStatus.Completed]: '已完成',
  [StageStatus.Archived]: '已归档',
};

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getTournamentStatusLabel(status: TournamentStatus) {
  return TOURNAMENT_STATUS_LABELS[status] ?? status;
}

export function getStageStatusLabel(status: StageStatus) {
  return STAGE_STATUS_LABELS[status] ?? status;
}
