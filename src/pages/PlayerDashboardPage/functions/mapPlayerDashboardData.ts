import { GetPublicClubAPI } from '@/api/club';
import { GetPublicTournamentAPI } from '@/api/tournament';
import type {
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/pages/objects/tournament';
import type {
  PublicTournamentDetailView,
  PublicTournamentStageView,
} from '@/objects';
import { sendAPI } from '@/system/api';

import type { PlayerClubLink, RecentTableItem } from '../objects/PlayerDashboard.types';

function getStageFormatLabel(format?: string) {
  switch (format) {
    case 'Knockout':
      return '淘汰赛';
    case 'Swiss':
      return '瑞士轮';
    default:
      return undefined;
  }
}

function getStageDisplayName(
  tournament: PublicTournamentDetailView,
  stage?: PublicTournamentStageView,
) {
  const formatLabel = getStageFormatLabel(stage?.format);

  if (formatLabel) {
    return `${tournament.name} ${formatLabel}`;
  }

  return stage?.name ?? undefined;
}

export function getPlayerClubLinks(clubIds: string[]) {
  return Promise.all(
    clubIds.map(async (clubId) => {
      try {
        return {
          id: clubId,
          name: await sendAPI(new GetPublicClubAPI(clubId)).then(
            (club) => club.name,
          ),
        };
      } catch {
        return {
          id: clubId,
          name: clubId,
        };
      }
    }),
  ) satisfies Promise<PlayerClubLink[]>;
}

export async function withTournamentNames(
  tables: TournamentTableSummary[],
): Promise<RecentTableItem[]> {
  const tournamentNames = new Map<string, string>();
  await Promise.all(
    [
      ...new Set(tables.map((table) => table.tournamentId).filter(Boolean)),
    ].map(async (tournamentId) => {
      try {
        const tournamentName = await sendAPI(
          new GetPublicTournamentAPI(tournamentId),
        ).then((tournament) => tournament.name);
        tournamentNames.set(tournamentId, tournamentName);
      } catch {
        tournamentNames.set(tournamentId, tournamentId);
      }
    }),
  );

  return tables.map((table) => ({
    ...table,
    tournamentName: tournamentNames.get(table.tournamentId) ?? table.tournamentId,
  }));
}

export async function withRecordDisplayNames(
  records: MatchRecordSummary[],
): Promise<MatchRecordSummary[]> {
  const recordTournamentDetails = new Map<string, PublicTournamentDetailView>();

  await Promise.all(
    [
      ...new Set(records.map((record) => record.tournamentId).filter(Boolean)),
    ].map(async (tournamentId) => {
      try {
        recordTournamentDetails.set(
          tournamentId,
          await sendAPI(new GetPublicTournamentAPI(tournamentId)),
        );
      } catch {
        // Keep ids as fallback labels when public detail is unavailable.
      }
    }),
  );

  return records.map((record) => {
    const tournament = recordTournamentDetails.get(record.tournamentId);
    const stage = tournament?.stages.find(
      (candidate) => candidate.stageId === record.stageId,
    );

    return {
      ...record,
      tournamentName: tournament?.name ?? record.tournamentId,
      stageName: tournament
        ? getStageDisplayName(tournament, stage) ?? record.stageId
        : record.stageId,
    };
  });
}
