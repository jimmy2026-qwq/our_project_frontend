import {
  TournamentGetAPI,
  TournamentListAPI,
} from '@/api/tournament';
import { mapTournamentDirectoryEntry } from '@/pages/objects/tournament';
import { sendAPI } from '@/system/api';

import { mapAdminStageStatus } from '../../../functions/mapPublicHall';
import type {
  PublicHallViewerContext,
  PublicSchedule,
} from '../../../objects/PublicHallPage.types';

export async function loadManagedDraftSchedules(
  context: PublicHallViewerContext,
): Promise<PublicSchedule[]> {
  const session = context.session;
  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canManageTournament =
    !!session?.user.roles.isRegisteredPlayer &&
    (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

  if (!canManageTournament || !operatorId) {
    return [];
  }

  const tournaments = await sendAPI(
    new TournamentListAPI({
      adminId: operatorId,
      status: 'Draft',
      limit: 50,
      offset: 0,
    }),
  ).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(mapTournamentDirectoryEntry),
  }));

  const stagesByTournament = await Promise.all(
    tournaments.items.map(async (tournament) => {
      const detail = await sendAPI(new TournamentGetAPI(tournament.id));
      const stages = detail.stages ?? [];

      if (stages.length === 0) {
        return [
          {
            tournamentId: detail.tournamentId,
            tournamentName: detail.name,
            tournamentStatus: 'Draft',
            stageId: `${detail.tournamentId}-draft-stage`,
            stageName: 'Draft stage',
            stageStatus: 'Pending',
            scheduledAt: detail.startsAt,
            isUnpublished: true,
          } satisfies PublicSchedule,
        ];
      }

      return stages.map(
        (stage) =>
          ({
            tournamentId: detail.tournamentId,
            tournamentName: detail.name,
            tournamentStatus: 'Draft',
            stageId: stage.stageId,
            stageName: stage.name,
            stageStatus: mapAdminStageStatus(stage.status),
            scheduledAt: detail.startsAt,
            isUnpublished: true,
          }) satisfies PublicSchedule,
      );
    }),
  );

  return stagesByTournament
    .flat()
    .sort(
      (left, right) =>
        Date.parse(left.scheduledAt) - Date.parse(right.scheduledAt),
    );
}
