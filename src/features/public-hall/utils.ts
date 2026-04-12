import type {
  ClubSummary,
  PlayerLeaderboardEntry,
  StageStatus,
  TournamentStatus,
} from '@/domain';

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
      '': '全部赛事',
      Draft: '未发布',
      Registration: '报名准备中',
      RegistrationOpen: '报名中',
      InProgress: '进行中',
      Finished: '已结束',
    } as const
  )[status];
}

export function getStageStatusLabel(status: StageStatus | '') {
  return (
    {
      '': '全部阶段',
      Pending: '未开始',
      Active: '进行中',
      Completed: '已完成',
    } as const
  )[status];
}

export function getRelationLabel(relation: ClubSummary['relations'][number]) {
  return relation === 'Alliance' ? '联盟' : '对抗';
}

export function getLeaderboardStatusLabel(status: PlayerLeaderboardEntry['status'] | '') {
  return (
    {
      '': '全部玩家',
      Active: '活跃',
      Inactive: '未活跃',
      Banned: '封禁',
    } as const
  )[status];
}
