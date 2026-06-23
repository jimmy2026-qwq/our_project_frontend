import { ClubApplicationStatuses, PlayerStatus, StageStatus, TournamentStatuses } from '@/objects';

type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const successStatuses = new Set<string>([
  TournamentStatuses.Completed,
  StageStatus.Active,
  StageStatus.Completed,
  ClubApplicationStatuses.Approved,
  PlayerStatus.Active,
]);

const infoStatuses = new Set<string>([
  TournamentStatuses.RegistrationOpen,
  TournamentStatuses.Scheduled,
  TournamentStatuses.InProgress,
  StageStatus.Ready,
]);

const warningStatuses = new Set<string>([
  TournamentStatuses.Draft,
  StageStatus.Pending,
  ClubApplicationStatuses.Pending,
  PlayerStatus.Suspended,
]);

const dangerStatuses = new Set<string>([
  TournamentStatuses.Cancelled,
  ClubApplicationStatuses.Rejected,
  PlayerStatus.Banned,
]);

export const getStatusTone = (
  value: string,
): StatusTone => {
  if (successStatuses.has(value)) {
    return 'success';
  }

  if (infoStatuses.has(value)) {
    return 'info';
  }

  if (warningStatuses.has(value)) {
    return 'warning';
  }

  if (dangerStatuses.has(value)) {
    return 'danger';
  }

  return 'neutral';
};
