import { useCallback } from 'react';

import { TournamentGetAPI, TournamentListAPI } from '@/api/tournament';
import { StageStatus, TournamentStatuses } from '@/objects';
import { sendAPI } from '@/system/api';

import { toStageStatus, toTournamentDirectoryEntry } from '../functions/toPublicHallData';
import type { PublicHallViewerContext } from '../objects/state/PublicHallViewerContext';
import { PublicSchedule } from '../objects/schedule/PublicSchedule';

export function useManagedDraftSchedulesLoader() {
  return useCallback(
    async (context: PublicHallViewerContext): Promise<PublicSchedule[]> => {
      const session = context.session;
      const operatorId = session?.user.operatorId ?? session?.user.userId;
      const canManageTournament =
        !!session?.user.roles.isRegisteredPlayer &&
        (session.user.roles.isSuperAdmin ||
          session.user.roles.isTournamentAdmin);

      if (!canManageTournament || !operatorId) {
        return [];
      }

      const tournaments = await sendAPI(
        new TournamentListAPI({
          adminId: operatorId,
          status: TournamentStatuses.Draft,
          limit: 50,
          offset: 0,
        }),
      ).then((envelope) => ({
        ...envelope,
        items: envelope.items.map(toTournamentDirectoryEntry),
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
                tournamentStatus: TournamentStatuses.Draft,
                stageId: `${detail.tournamentId}-draft-stage`,
                stageName: 'Draft stage',
                stageStatus: StageStatus.Pending,
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
                tournamentStatus: TournamentStatuses.Draft,
                stageId: stage.stageId,
                stageName: stage.name,
                stageStatus: toStageStatus(stage.status),
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
    },
    [],
  );
}
