import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuthContext } from '@/app/auth/useAuthContext';
import type { RealtimeEvent } from '@/app/realtime/RealtimeEvent';
import { useRealtimeRefresh } from '@/app/realtime/useRealtimeRefresh';
import { useShowcaseMode } from '@/app/showcaseMode';
import type {
  MahjongLegalAction,
  MahjongPublicEventView,
  MahjongTableView,
} from '@/objects';
import type { TableDetail } from '@/pages/shared_objects/tournament/TableDetail';

import { useTableMatchData } from './useTableMatchData';
import { useTableMatchMahjongState } from './useTableMatchMahjongState';
import { useTableMatchPlayerNames } from './useTableMatchPlayerNames';
import { useTableMatchReadyAction } from './useTableMatchReadyAction';
import { useTableMatchSeatState } from './useTableMatchSeatState';
import type { TableSeatMap } from '../functions/getTableSeatMap';

interface TableMatchPageStatus {
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
}

interface TableMatchPageNavigation {
  backLink: string;
}

interface TableMatchPageViewer {
  isRegisteredPlayer: boolean;
  operatorId: string;
  playerId: string;
}

interface TableMatchPageReadyAction {
  canUpdateOwnReady: boolean;
  isUpdatingOwnReady: boolean;
  onToggleOwnReady: () => void;
}

interface TableMatchPageMahjong {
  actionError: string | null;
  error: string | null;
  finalSettlementTable: MahjongTableView | null;
  isLoading: boolean;
  isSubmittingAction: boolean;
  mahjongTable: MahjongTableView | null;
  mahjongAcceptedEvent: MahjongPublicEventView | null;
  shouldShowMatchBoard: boolean;
  onAdvanceRound: () => void;
  onConfirmFinalSettlement: () => void;
  onSubmitAction: (action: MahjongLegalAction) => void;
}

interface TableMatchPageSeats {
  ownSeat: TableDetail['seats'][number] | null;
  seatMap: TableSeatMap;
}

export interface TableMatchPageModel {
  mahjong: TableMatchPageMahjong;
  navigation: TableMatchPageNavigation;
  players: {
    names: Record<string, string>;
  };
  readyAction: TableMatchPageReadyAction;
  seats: TableMatchPageSeats;
  showcaseMode: boolean;
  status: TableMatchPageStatus;
  table: TableDetail | null;
  viewer: TableMatchPageViewer;
  onRefresh: () => void;
}

export function useTableMatchPageModel(): TableMatchPageModel {
  const { tableId = '' } = useParams();
  const navigate = useNavigate();
  const { session } = useAuthContext();
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const [showcaseMode] = useShowcaseMode();
  const isRegisteredPlayer = !!session?.user.roles.isRegisteredPlayer;
  const tableData = useTableMatchData(tableId);
  const { seatMap, ownSeat, canUpdateOwnReady } = useTableMatchSeatState(
    tableData.table,
    operatorId,
    isRegisteredPlayer,
  );
  const viewerPlayerId = ownSeat?.playerId ?? '';
  const readyAction = useTableMatchReadyAction({
    table: tableData.table,
    ownSeat,
    operatorId,
    setTable: tableData.setTable,
    setError: tableData.setError,
  });
  const mahjongState = useTableMatchMahjongState({
    operatorId,
    tableId,
    viewerPlayerId,
  });
  const playerIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...(tableData.table?.seats.map((seat) => seat.playerId) ?? []),
          ...(mahjongState.mahjongTable?.seats.map((seat) => seat.playerId) ??
            []),
        ]),
      ),
    [mahjongState.mahjongTable, tableData.table],
  );
  const playerNames = useTableMatchPlayerNames(playerIds);
  const backLink = tableData.table?.tournamentId
    ? `/public/tournaments/${tableData.table.tournamentId}`
    : '/public';

  const handleRefresh = useCallback(() => {
    tableData.forceReload();
    mahjongState.reload();
  }, [mahjongState, tableData]);
  const handleRealtimeRefresh = useCallback(
    (event: RealtimeEvent) => {
      if (mahjongState.handleRealtimeMahjongEvent(event)) {
        return;
      }

      if (
        event.aggregateType === 'mahjongTable' &&
        event.aggregateId !== tableId
      ) {
        return;
      }

      handleRefresh();
    },
    [handleRefresh, mahjongState, tableId],
  );
  const handleAdvanceRound = useCallback(() => {
    void mahjongState.advanceRound();
  }, [mahjongState]);
  const handleConfirmFinalSettlement = useCallback(() => {
    mahjongState.clearFinalSettlement();
    navigate(backLink);
  }, [backLink, mahjongState, navigate]);
  const handleSubmitAction = useCallback(
    (action: MahjongLegalAction) => {
      void mahjongState.submitAction(action);
    },
    [mahjongState],
  );
  const handleToggleOwnReady = useCallback(() => {
    void readyAction.handleToggleOwnReady();
  }, [readyAction]);

  useRealtimeRefresh(
    [
      'TournamentTableChanged',
      'MahjongTableChanged',
      'MahjongActionAccepted',
      'AppealChanged',
    ],
    handleRealtimeRefresh,
  );

  return {
    mahjong: {
      actionError: mahjongState.actionError,
      error: mahjongState.error,
      finalSettlementTable: mahjongState.finalSettlementTable,
      isLoading: mahjongState.isLoading,
      isSubmittingAction: mahjongState.isSubmittingAction,
      mahjongAcceptedEvent: mahjongState.acceptedEvent,
      mahjongTable: mahjongState.mahjongTable,
      onAdvanceRound: handleAdvanceRound,
      onConfirmFinalSettlement: handleConfirmFinalSettlement,
      onSubmitAction: handleSubmitAction,
      shouldShowMatchBoard: Boolean(mahjongState.mahjongTable?.currentRound),
    },
    navigation: {
      backLink,
    },
    players: {
      names: playerNames,
    },
    readyAction: {
      canUpdateOwnReady,
      isUpdatingOwnReady: readyAction.isUpdatingOwnReady,
      onToggleOwnReady: handleToggleOwnReady,
    },
    seats: {
      ownSeat,
      seatMap,
    },
    showcaseMode,
    status: {
      error: tableData.error,
      isLoading: tableData.isLoading,
      isRefreshing: tableData.isRefreshing || mahjongState.isRefreshing,
    },
    table: tableData.table,
    viewer: {
      isRegisteredPlayer,
      operatorId,
      playerId: viewerPlayerId,
    },
    onRefresh: handleRefresh,
  };
}
