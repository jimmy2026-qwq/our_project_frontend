import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useCallback } from 'react';

import {
  MahjongCoreAdvanceRoundAPI,
  MahjongCoreArchiveTableAPI,
  MahjongCoreGetTableAPI,
} from '@/api/tournament/mahjongcore';
import type {
  AdvanceMahjongRoundRequest,
  MahjongActionResponse,
  MahjongTableView,
} from '@/objects';
import { MahjongTableStatuses } from '@/objects';
import { sendAPI } from '@/system/api';

import {
  createMahjongTableQuery,
  getMahjongErrorMessage,
} from '../functions/getTableMatchMahjongState';

interface UseTableMatchRoundAdvanceParams {
  operatorId: string;
  previousTableRef: MutableRefObject<MahjongTableView | null>;
  reload: () => void;
  setActionError: Dispatch<SetStateAction<string | null>>;
  setFinalSettlementTable: Dispatch<SetStateAction<MahjongTableView | null>>;
  setIsRefreshing: Dispatch<SetStateAction<boolean>>;
  setMahjongTable: Dispatch<SetStateAction<MahjongTableView | null>>;
  tableId: string;
  viewerPlayerId: string;
}

export function useTableMatchRoundAdvance({
  operatorId,
  previousTableRef,
  reload,
  setActionError,
  setFinalSettlementTable,
  setIsRefreshing,
  setMahjongTable,
  tableId,
  viewerPlayerId,
}: UseTableMatchRoundAdvanceParams) {
  return useCallback(async () => {
    try {
      setIsRefreshing(true);
      setActionError(null);

      const request: AdvanceMahjongRoundRequest = {};
      if (viewerPlayerId) {
        request.playerId = viewerPlayerId;
      }

      const response = await sendAPI<MahjongTableView>(
        new MahjongCoreAdvanceRoundAPI(tableId, request),
      );
      if (response.status === MahjongTableStatuses.Finished) {
        setFinalSettlementTable(response);
      }
      const resolvedTable =
        response.status === MahjongTableStatuses.Finished
          ? (
              await sendAPI<MahjongActionResponse>(
                new MahjongCoreArchiveTableAPI(tableId, {
                  operatorId: operatorId || viewerPlayerId || null,
                }),
              )
            ).table
          : response;

      if (!operatorId && !viewerPlayerId) {
        previousTableRef.current = resolvedTable;
        setMahjongTable(resolvedTable);
        return;
      }

      const viewerTable = await sendAPI<MahjongTableView>(
        new MahjongCoreGetTableAPI(
          tableId,
          createMahjongTableQuery({ operatorId, viewerPlayerId }),
        ),
      );
      previousTableRef.current = viewerTable;
      setMahjongTable(viewerTable);
    } catch (advanceError) {
      setActionError(getMahjongErrorMessage(advanceError));
      reload();
    } finally {
      setIsRefreshing(false);
    }
  }, [
    operatorId,
    previousTableRef,
    reload,
    setActionError,
    setFinalSettlementTable,
    setIsRefreshing,
    setMahjongTable,
    tableId,
    viewerPlayerId,
  ]);
}
