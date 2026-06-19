import { StageStatuses, TournamentStatuses } from '@/objects';

import type { TournamentPublicProfile } from '../objects/PublicTournamentDetailPage.types';
import type { TournamentDetailTableItem } from '../objects/TournamentDetail.types';

type TournamentStageView = NonNullable<
  TournamentPublicProfile['stages']
>[number];

export function isTournamentStageCompleted(stage: TournamentStageView) {
  return (
    stage.status === StageStatuses.Completed ||
    stage.status === StageStatuses.Archived
  );
}

export function getTournamentDetailStageProgress({
  canManageTournament,
  missingLineupClubNames,
  profile,
  tables,
}: {
  canManageTournament: boolean;
  missingLineupClubNames: string[];
  profile: TournamentPublicProfile;
  tables: TournamentDetailTableItem[];
}) {
  const orderedStages = [...(profile.stages ?? [])].sort(
    (left, right) => (left.order ?? 0) - (right.order ?? 0),
  );
  const isTournamentClosed =
    profile.status === TournamentStatuses.Completed ||
    profile.status === TournamentStatuses.Archived;
  const declaredNextStage = orderedStages.find(
    (stage) => stage.stageId === profile.nextStageId,
  );
  const nextStage =
    declaredNextStage && !isTournamentStageCompleted(declaredNextStage)
      ? declaredNextStage
      : (orderedStages.find((stage) => !isTournamentStageCompleted(stage)) ??
        null);
  const nextStageTables = nextStage
    ? tables.filter((table) => table.stageId === nextStage.stageId)
    : [];
  const isWaitingForLineups =
    canManageTournament &&
    !!profile.nextStageId &&
    (profile.status === TournamentStatuses.RegistrationOpen ||
      profile.status === TournamentStatuses.InProgress) &&
    missingLineupClubNames.length > 0;
  const canScheduleStage =
    canManageTournament &&
    !!nextStage &&
    !isTournamentClosed &&
    (profile.status === TournamentStatuses.RegistrationOpen ||
      profile.status === TournamentStatuses.Scheduled ||
      profile.status === TournamentStatuses.InProgress) &&
    missingLineupClubNames.length === 0 &&
    !isTournamentStageCompleted(nextStage) &&
    nextStageTables.length === 0 &&
    (nextStage.tableCount ?? 0) === 0;

  return {
    orderedStages,
    isTournamentClosed,
    nextStage,
    nextStageTables,
    isWaitingForLineups,
    canScheduleStage,
  };
}
