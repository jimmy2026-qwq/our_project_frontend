import type {
  ClubSummary,
  PlayerLeaderboardEntry,
  StageStatus,
  TournamentStatus,
} from '@/domain/models';

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
    {
      '': 'All tournaments',
      Draft: 'Draft',
      Registration: 'Registration',
      RegistrationOpen: '报名中',
      InProgress: 'In progress',
      Finished: 'Finished',
    } as const
  )[status];
}

export function getStageStatusLabel(status: StageStatus | '') {
  return (
    {
      '': 'All stages',
      Pending: 'Pending',
      Active: 'Active',
      Completed: 'Completed',
    } as const
  )[status];
}

export function getRelationLabel(relation: ClubSummary['relations'][number]) {
  return relation === 'Alliance' ? 'Alliance' : 'Hostile';
}

export function getLeaderboardStatusLabel(status: PlayerLeaderboardEntry['status'] | '') {
  return (
    {
      '': 'All players',
      Active: 'Active',
      Inactive: 'Inactive',
      Banned: 'Banned',
    } as const
  )[status];
}
