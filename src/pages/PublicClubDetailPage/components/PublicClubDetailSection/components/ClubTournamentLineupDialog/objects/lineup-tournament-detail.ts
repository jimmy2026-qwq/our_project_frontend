import { GetPublicTournamentAPI } from '@/api/tournament';
import {
  TournamentGetAPI,
  TournamentStageDirectoryAPI,
} from '@/api/tournament';
import type {
  TournamentDetailView,
  TournamentFormat,
  TournamentOperationsStageView,
  TournamentStageDirectoryEntry,
} from '@/objects/tournament';
import { sendAPI } from '@/system/api';

import { mapPublicTournamentDetail } from '../../../../../objects/mappers';
import type { TournamentPublicProfile } from '../../../../../objects/types';
import type { ClubTournamentItem } from '../types';

type PublicTournamentStage = NonNullable<
  TournamentPublicProfile['stages']
>[number];

const fallbackAdvancementRule = {
  ruleType: 'Custom',
  cutSize: null,
  thresholdScore: null,
  targetTableCount: null,
  templateKey: null,
  note: 'unconfigured',
} as const;

export function getSelectedPlayerIds(
  detail: TournamentDetailView | null,
  clubId: string,
  stageId: string,
) {
  const stage = detail?.stages?.find((item) => item.stageId === stageId);
  const submission = stage?.lineupSubmissions?.find(
    (item) => item.clubId === clubId,
  );
  return [
    ...(submission?.activePlayerIds ?? []),
    ...(submission?.reservePlayerIds ?? []),
  ];
}

export async function loadTournamentDetailForLineup(
  tournament: ClubTournamentItem,
): Promise<TournamentDetailView> {
  const [detailResult, stageDirectory, publicStages] = await Promise.all([
    sendAPI(new TournamentGetAPI(tournament.id)).catch(() => null),
    loadTournamentStageDirectory(tournament.id),
    loadPublicStagesForLineup(tournament.id),
  ]);

  const fallbackStages =
    stageDirectory.length > 0
      ? stageDirectory.map(mapStageDirectoryEntryToDetailStage)
      : publicStages;

  if (detailResult) {
    return {
      ...detailResult,
      stages: mergeTournamentStages(
        fallbackStages,
        detailResult.stages ?? [],
      ),
    };
  }

  if (fallbackStages.length > 0) {
    return {
      tournamentId: tournament.id,
      name: tournament.name,
      organizer: '',
      status: tournament.status ?? 'RegistrationOpen',
      startsAt: '',
      endsAt: '',
      participatingClubs: [],
      participatingPlayers: [],
      whitelistSummary: {
        totalEntries: 0,
        clubCount: 0,
        playerCount: 0,
        clubIds: [],
        playerIds: [],
      },
      stages: fallbackStages,
    };
  }

  throw new Error('No lineup stage is available for this tournament yet.');
}

async function loadTournamentStageDirectory(tournamentId: string) {
  try {
    return await sendAPI(new TournamentStageDirectoryAPI(tournamentId));
  } catch {
    return [];
  }
}

async function loadPublicStagesForLineup(tournamentId: string) {
  try {
    const publicDetail = await sendAPI(
      new GetPublicTournamentAPI(tournamentId),
    ).then(mapPublicTournamentDetail);
    return (publicDetail.stages ?? []).map(mapPublicStageToDetailStage);
  } catch {
    return [];
  }
}

function mapStageDirectoryEntryToDetailStage(
  stage: TournamentStageDirectoryEntry,
): TournamentOperationsStageView {
  return {
    stageId: stage.stageId,
    name: stage.name,
    status: stage.status,
    format: stage.format,
    order: stage.order,
    currentRound: stage.currentRound,
    roundCount: stage.roundCount,
    schedulingPoolSize: stage.schedulingPoolSize,
    pendingTablePlanCount: stage.pendingTablePlanCount,
    scheduledTableCount: stage.scheduledTableCount,
    advancementRule: fallbackAdvancementRule,
    swissRule: null,
    knockoutRule: null,
    lineupSubmissions: [],
  };
}

function mapPublicStageToDetailStage(
  stage: PublicTournamentStage,
): TournamentOperationsStageView {
  return {
    stageId: stage.stageId,
    name: stage.name,
    status: stage.status,
    format: normalizeTournamentFormat(stage.format),
    order: stage.order ?? 0,
    currentRound: stage.currentRound ?? 0,
    roundCount: stage.roundCount,
    schedulingPoolSize: stage.schedulingPoolSize ?? 0,
    pendingTablePlanCount: stage.pendingTablePlanCount,
    scheduledTableCount: stage.tableCount,
    advancementRule: stage.advancementRule ?? fallbackAdvancementRule,
    swissRule: stage.swissRule ?? null,
    knockoutRule: stage.knockoutRule ?? null,
    lineupSubmissions:
      stage.lineupSubmissions?.map((submission) => ({
        ...submission,
        note: submission.note ?? null,
      })) ?? [],
  };
}

function normalizeTournamentFormat(format?: string): TournamentFormat {
  switch (format) {
    case 'Swiss':
    case 'Knockout':
    case 'RoundRobin':
    case 'Finals':
    case 'Custom':
      return format;
    default:
      return 'Custom';
  }
}

function mergeTournamentStages(
  stageDirectory: TournamentOperationsStageView[],
  detailStages: TournamentOperationsStageView[],
) {
  const detailById = new Map(
    detailStages.map((stage) => [stage.stageId, stage]),
  );
  const mergedDirectory = stageDirectory.map((stage) => {
    const detailStage = detailById.get(stage.stageId);

    if (!detailStage) {
      return stage;
    }

    return {
      ...stage,
      ...detailStage,
      stageId: stage.stageId,
      name: detailStage.name || stage.name,
      status: detailStage.status || stage.status,
    };
  });

  const extraDetailStages = detailStages.filter(
    (stage) =>
      !stageDirectory.some(
        (directoryStage) => directoryStage.stageId === stage.stageId,
      ),
  );

  return [...mergedDirectory, ...extraDetailStages];
}
