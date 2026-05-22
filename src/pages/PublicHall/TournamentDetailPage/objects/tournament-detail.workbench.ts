import type { ClubSummary } from '@/pages/objects/club';
import type {
  ClubPublicProfile,
  TournamentPublicProfile,
} from '@/pages/PublicHall/objects';

export function getTableStatusLabel(status: string) {
  switch (status) {
    case 'WaitingPreparation':
      return '等待准备';
    case 'InProgress':
      return '进行中';
    case 'Scoring':
      return '待结算';
    case 'AppealPending':
    case 'AppealInProgress':
      return '申诉处理中';
    case 'Archived':
      return '已归档';
    default:
      return status;
  }
}

export function getTableSortWeight(status: string) {
  switch (status) {
    case 'InProgress':
    case 'Scoring':
    case 'AppealPending':
    case 'AppealInProgress':
      return 0;
    case 'Archived':
      return 1;
    case 'WaitingPreparation':
      return 2;
    default:
      return 3;
  }
}

export function getTableStatusTone(status: string) {
  switch (status) {
    case 'InProgress':
      return 'success' as const;
    case 'Scoring':
      return 'warning' as const;
    case 'AppealPending':
    case 'AppealInProgress':
      return 'danger' as const;
    case 'Archived':
      return 'neutral' as const;
    case 'WaitingPreparation':
      return 'warning' as const;
    default:
      return 'neutral' as const;
  }
}

export function getNextStageMissingLineupClubNames(
  profile: TournamentPublicProfile,
  availableClubs: ClubSummary[],
) {
  const invitedClubIds = profile.clubIds ?? [];
  const nextStage = profile.stages?.find(
    (stage) => stage.stageId === profile.nextStageId,
  );

  if (!nextStage || invitedClubIds.length === 0) {
    return [];
  }

  const submittedClubIds = new Set(
    (nextStage.lineupSubmissions ?? [])
      .filter((submission) => submission.activePlayerIds.length > 0)
      .map((submission) => submission.clubId),
  );

  return invitedClubIds
    .filter((clubId) => !submittedClubIds.has(clubId))
    .map(
      (clubId) =>
        availableClubs.find((club) => club.id === clubId)?.name ?? clubId,
    );
}

export function getNextStageLineupSubmissionCounts(
  profile: TournamentPublicProfile,
) {
  const nextStage = profile.stages?.find(
    (stage) => stage.stageId === profile.nextStageId,
  );

  if (!nextStage) {
    return {} as Record<string, number>;
  }

  return Object.fromEntries(
    (nextStage.lineupSubmissions ?? [])
      .filter((submission) => submission.activePlayerIds.length > 0)
      .map((submission) => [
        submission.clubId,
        submission.activePlayerIds.length,
      ]),
  );
}

export function mapClubPublicProfileToSummary(
  profile: ClubPublicProfile,
): ClubSummary {
  return {
    id: profile.id,
    name: profile.name,
    memberCount: profile.memberCount,
    activeMemberCount: profile.activeMemberCount ?? profile.memberCount,
    adminCount: profile.adminCount ?? 0,
    powerRating: profile.powerRating,
    treasury: profile.treasury,
    totalPoints: profile.totalPoints ?? 0,
    pointPool: profile.pointPool ?? 0,
    allianceCount: profile.relations.filter(
      (relation) => relation === 'Alliance',
    ).length,
    rivalryCount: profile.relations.filter(
      (relation) => relation === 'Hostile',
    ).length,
    relations: profile.relations,
  };
}

export function createFallbackClubSummary(clubId: string): ClubSummary {
  return {
    id: clubId,
    name: clubId,
    memberCount: 0,
    activeMemberCount: 0,
    adminCount: 0,
    powerRating: 0,
    treasury: 0,
    totalPoints: 0,
    pointPool: 0,
    allianceCount: 0,
    rivalryCount: 0,
    relations: [],
  };
}
