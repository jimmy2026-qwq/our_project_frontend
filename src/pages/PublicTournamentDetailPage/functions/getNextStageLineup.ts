import type { ClubSummary } from '@/pages/objects/ClubSummary';

import type { TournamentPublicProfile } from '../objects/PublicTournamentDetailPage.types';

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
