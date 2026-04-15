import { operationsApi } from '@/api/operations';
import { publicApi } from '@/api/public';
import type { ClubSummary, PublicSchedule } from '@/domain/public';

import type { LoadState, PublicHallState, PublicHallViewerContext } from './types';
import { mapAdminStageStatus } from './data.shared';

function createEmptyLoadState<T>(): LoadState<T> {
  return {
    envelope: {
      items: [],
      total: 0,
      limit: 0,
      offset: 0,
      hasMore: false,
      appliedFilters: {},
    },
    source: 'api',
  };
}

export async function loadSchedules(state: PublicHallState): Promise<LoadState<PublicSchedule>> {
  try {
    const envelope = await publicApi.getPublicSchedules({
      tournamentStatus: state.scheduleTournamentStatus || undefined,
      stageStatus: state.scheduleStageStatus || undefined,
    });
    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<PublicSchedule>(),
      warning: error instanceof Error ? error.message : 'Unable to load public schedules.',
    };
  }
}

export async function loadManagedDraftSchedules(context: PublicHallViewerContext): Promise<PublicSchedule[]> {
  const session = context.session;
  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canManageTournament =
    !!session?.user.roles.isRegisteredPlayer &&
    (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);

  if (!canManageTournament || !operatorId) {
    return [];
  }

  const tournaments = await operationsApi.getTournaments({
    adminId: operatorId,
    status: 'Draft',
    limit: 50,
    offset: 0,
  });

  const stagesByTournament = await Promise.all(
    tournaments.items.map(async (tournament) => {
      const detail = await operationsApi.getTournament(tournament.id);
      const stages = detail.stages ?? [];

      if (stages.length === 0) {
        return [
          {
            tournamentId: detail.id,
            tournamentName: detail.name,
            tournamentStatus: 'Draft',
            stageId: `${detail.id}-draft-stage`,
            stageName: 'Draft stage',
            stageStatus: 'Pending',
            scheduledAt: detail.startsAt,
            isUnpublished: true,
          } satisfies PublicSchedule,
        ];
      }

      return stages.map((stage) => ({
        tournamentId: detail.id,
        tournamentName: detail.name,
        tournamentStatus: 'Draft',
        stageId: stage.id,
        stageName: stage.name,
        stageStatus: mapAdminStageStatus(stage.status),
        scheduledAt: detail.startsAt,
        isUnpublished: true,
      } satisfies PublicSchedule));
    }),
  );

  return stagesByTournament.flat().sort((left, right) => Date.parse(left.scheduledAt) - Date.parse(right.scheduledAt));
}

export async function loadClubs(_state: PublicHallState): Promise<LoadState<ClubSummary>> {
  try {
    const envelope = await publicApi.getPublicClubs();
    return { envelope, source: 'api' };
  } catch (error) {
    return {
      ...createEmptyLoadState<ClubSummary>(),
      warning: error instanceof Error ? error.message : 'Unable to load club directory.',
    };
  }
}
