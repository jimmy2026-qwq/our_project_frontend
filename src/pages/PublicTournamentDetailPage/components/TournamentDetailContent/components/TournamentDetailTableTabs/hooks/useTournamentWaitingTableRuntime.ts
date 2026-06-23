import { useEffect, useState } from 'react';

import { TournamentTableGetAPI, TournamentTableUpdateOwnReadyAPI } from '@/api/tournament';
import { TableStatus } from '@/objects';
import type { TableDetail } from '@/pages/shared_objects/tournament/TableDetail';
import { sendAPI } from '@/system/api';

import type { TournamentDetailWorkbenchState } from '@/pages/PublicTournamentDetailPage/objects/state/workbench/TournamentDetailWorkbenchState';
import { toTableDetail } from '../../../../../functions/toTournamentDetailTableData';

export function useTournamentWaitingTableRuntime({
  operatorId,
  setTableDetailError,
  workbench,
}: {
  operatorId: string;
  setTableDetailError: (message: string) => void;
  workbench: TournamentDetailWorkbenchState | null;
}) {
  const [participantWaitingTableDetails, setParticipantWaitingTableDetails] =
    useState<Record<string, TableDetail>>({});
  const [updatingReadyTableId, setUpdatingReadyTableId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!operatorId || !workbench?.visibleTables.length) {
      setParticipantWaitingTableDetails({});
      return;
    }

    const participantWaitingTables = workbench.visibleTables.filter(
      (table) =>
        table.status === TableStatus.WaitingPreparation &&
        table.playerIds.includes(operatorId),
    );

    if (participantWaitingTables.length === 0) {
      setParticipantWaitingTableDetails({});
      return;
    }

    let cancelled = false;

    void Promise.all(
      participantWaitingTables.map(async (table) => {
        try {
          const detail = await sendAPI(
            new TournamentTableGetAPI(table.id),
          ).then(toTableDetail);
          return [table.id, detail] as const;
        } catch {
          return [table.id, null] as const;
        }
      }),
    ).then((entries) => {
      if (!cancelled) {
        setParticipantWaitingTableDetails(
          Object.fromEntries(
            entries.filter(
              (entry): entry is readonly [string, TableDetail] =>
                entry[1] !== null,
            ),
          ),
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [operatorId, workbench?.visibleTables]);

  async function handleToggleOwnReady(tableId: string, isReady: boolean) {
    if (!operatorId) {
      return;
    }

    try {
      setUpdatingReadyTableId(tableId);
      setTableDetailError('');
      const nextDetail = await sendAPI(
        new TournamentTableUpdateOwnReadyAPI(tableId, {
          operatorId,
          ready: !isReady,
        }),
      ).then(toTableDetail);
      setParticipantWaitingTableDetails((current) => ({
        ...current,
        [tableId]: nextDetail,
      }));
    } catch (error) {
      setTableDetailError(
        error instanceof Error ? error.message : '无法更新你的准备状态。',
      );
    } finally {
      setUpdatingReadyTableId(null);
    }
  }

  return {
    participantWaitingTableDetails,
    updatingReadyTableId,
    handleToggleOwnReady,
  };
}
