import { TournamentPaifuListAPI } from '@/api/tournament/TournamentPaifuListAPI';
import type { ListEnvelope, TournamentPaifuSummaryView } from '@/objects';
import { sendAPI } from '@/system/api';

import type { TablePaifuDetail } from './types';

function mapPaifuSummary(
  item: TournamentPaifuSummaryView | TablePaifuDetail,
): TablePaifuDetail {
  const legacy = item as Partial<TablePaifuDetail>;
  const summary = item as TablePaifuDetail & {
    paifuId?: string;
    tableId?: string;
    tournamentId?: string;
    stageId?: string;
    recordedAt?: string;
  };

  return {
    ...item,
    id: legacy.id ?? summary.paifuId ?? '',
    metadata: legacy.metadata ?? {
      tableId: summary.tableId ?? '',
      tournamentId: summary.tournamentId ?? '',
      stageId: summary.stageId ?? '',
      recordedAt: summary.recordedAt ?? '',
    },
    rounds: legacy.rounds ?? [],
    finalStandings: item.finalStandings ?? [],
  };
}

export async function loadTablePaifus(
  tableId: string,
): Promise<ListEnvelope<TablePaifuDetail>> {
  const envelope = await sendAPI<ListEnvelope<TournamentPaifuSummaryView>>(
    new TournamentPaifuListAPI({ tableId }),
  );

  return {
    ...envelope,
    items: envelope.items.map(mapPaifuSummary),
  };
}
