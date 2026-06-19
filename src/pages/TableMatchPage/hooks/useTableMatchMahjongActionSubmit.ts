import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useCallback } from 'react';

import { MahjongCoreSubmitActionAPI } from '@/api/tournament/mahjongcore';
import type {
  MahjongActionResponse,
  MahjongLegalAction,
  MahjongPublicEventView,
  MahjongTableView,
  SubmitMahjongActionRequest,
} from '@/objects';
import { sendAPI } from '@/system/api';

import {
  createIdempotencyKey,
  getMahjongErrorMessage,
} from '../functions/getTableMatchMahjongState';

interface UseTableMatchMahjongActionSubmitParams {
  lastHandledFlashSequenceNoRef: MutableRefObject<number>;
  lastSeenEventSequenceNoRef: MutableRefObject<number>;
  previousTableRef: MutableRefObject<MahjongTableView | null>;
  reload: () => void;
  setAcceptedEvent: Dispatch<SetStateAction<MahjongPublicEventView | null>>;
  setActionError: Dispatch<SetStateAction<string | null>>;
  setIsSubmittingAction: Dispatch<SetStateAction<boolean>>;
  setMahjongTable: Dispatch<SetStateAction<MahjongTableView | null>>;
  tableId: string;
  viewerPlayerId: string;
}

export function useTableMatchMahjongActionSubmit({
  lastHandledFlashSequenceNoRef,
  lastSeenEventSequenceNoRef,
  previousTableRef,
  reload,
  setAcceptedEvent,
  setActionError,
  setIsSubmittingAction,
  setMahjongTable,
  tableId,
  viewerPlayerId,
}: UseTableMatchMahjongActionSubmitParams) {
  return useCallback(
    async (action: MahjongLegalAction) => {
      if (!viewerPlayerId) {
        setActionError('需要登录到选手身份后才能操作牌局。');
        return;
      }

      try {
        setIsSubmittingAction(true);
        setActionError(null);

        const request: SubmitMahjongActionRequest = {
          commandType: action.commandType,
          idempotencyKey: createIdempotencyKey(),
          playerId: viewerPlayerId,
          targetSequenceNo: action.targetSequenceNo,
          tile: action.tile,
          tiles: action.tiles,
        };
        const response = await sendAPI<MahjongActionResponse>(
          new MahjongCoreSubmitActionAPI(tableId, request),
        );

        if (response.acceptedEvent) {
          lastHandledFlashSequenceNoRef.current =
            response.acceptedEvent.sequenceNo;
        }
        setAcceptedEvent(response.acceptedEvent);
        lastSeenEventSequenceNoRef.current =
          response.table.lastEventSequenceNo ??
          lastSeenEventSequenceNoRef.current;
        previousTableRef.current = response.table;
        setMahjongTable(response.table);
      } catch (submitError) {
        setActionError(getMahjongErrorMessage(submitError));
        reload();
      } finally {
        setIsSubmittingAction(false);
      }
    },
    [
      lastHandledFlashSequenceNoRef,
      lastSeenEventSequenceNoRef,
      previousTableRef,
      reload,
      setAcceptedEvent,
      setActionError,
      setIsSubmittingAction,
      setMahjongTable,
      tableId,
      viewerPlayerId,
    ],
  );
}
