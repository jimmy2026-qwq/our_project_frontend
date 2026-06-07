import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { useRealtimeRefresh } from '@/app/realtime/useRealtimeRefresh';
import { useShowcaseMode } from '@/app/showcaseMode';

import {
  TableMatchError,
  TableMatchLoading,
  TableMatchSection,
} from './components';
import { useTableMatchData } from './hooks/useTableMatchData';
import { useTableMatchMahjongState } from './hooks/useTableMatchMahjongState';
import { useTableMatchPlayerNames } from './hooks/useTableMatchPlayerNames';
import { useTableMatchReadyAction } from './hooks/useTableMatchReadyAction';
import { useTableMatchSeatState } from './hooks/useTableMatchSeatState';

export function TableMatchPage() {
  const { tableId = '' } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const [showcaseMode] = useShowcaseMode();
  const isRegisteredPlayer = !!session?.user.roles.isRegisteredPlayer;
  const {
    table,
    setTable,
    isLoading,
    isRefreshing,
    error,
    setError,
    forceReload,
  } = useTableMatchData(tableId);
  const { seatMap, ownSeat, canUpdateOwnReady } =
    useTableMatchSeatState(table, operatorId, isRegisteredPlayer);
  const matchPlayerId = ownSeat?.playerId ?? '';
  const readyAction = useTableMatchReadyAction({
    table,
    ownSeat,
    operatorId,
    setTable,
    setError,
  });
  const mahjongState = useTableMatchMahjongState({
    operatorId,
    tableId,
    viewerPlayerId: matchPlayerId,
  });
  const playerIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...(table?.seats.map((seat) => seat.playerId) ?? []),
          ...(mahjongState.mahjongTable?.seats.map((seat) => seat.playerId) ??
            []),
        ]),
      ),
    [mahjongState.mahjongTable, table],
  );
  const playerNames = useTableMatchPlayerNames(playerIds);
  const handleRefresh = useCallback(() => {
    forceReload();
    mahjongState.reload();
  }, [forceReload, mahjongState]);
  const handleAdvanceRound = useCallback(() => {
    void mahjongState.advanceRound();
  }, [mahjongState.advanceRound]);
  useRealtimeRefresh(
    ['TournamentTableChanged', 'MahjongTableChanged', 'AppealChanged'],
    handleRefresh,
  );
  const backLink = table?.tournamentId
    ? `/public/tournaments/${table.tournamentId}`
    : '/public';
  const handleConfirmFinalSettlement = useCallback(() => {
    mahjongState.clearFinalSettlement();
    navigate(backLink);
  }, [backLink, mahjongState, navigate]);

  if (isLoading) {
    return <TableMatchLoading />;
  }

  if (error || !table) {
    return (
      <TableMatchError
        error={error}
        backLink={backLink}
        onRetry={forceReload}
      />
    );
  }

  return (
    <TableMatchSection
      table={table}
      backLink={backLink}
      seatMap={seatMap}
      ownSeat={ownSeat}
      isRefreshing={isRefreshing}
      isMahjongRefreshing={mahjongState.isRefreshing}
      isMahjongLoading={mahjongState.isLoading}
      mahjongError={mahjongState.error}
      finalSettlementTable={mahjongState.finalSettlementTable}
      mahjongTable={mahjongState.mahjongTable}
      mahjongAcceptedEvent={mahjongState.acceptedEvent}
      playerNames={playerNames}
      showcaseMode={showcaseMode}
      isRegisteredPlayer={isRegisteredPlayer}
      operatorId={matchPlayerId}
      canUpdateOwnReady={canUpdateOwnReady}
      isUpdatingOwnReady={readyAction.isUpdatingOwnReady}
      isSubmittingMahjongAction={mahjongState.isSubmittingAction}
      mahjongActionError={mahjongState.actionError}
      onRefresh={handleRefresh}
      onToggleOwnReady={() => void readyAction.handleToggleOwnReady()}
      onAdvanceRound={handleAdvanceRound}
      onConfirmFinalSettlement={handleConfirmFinalSettlement}
      onSubmitMahjongAction={(action) => void mahjongState.submitAction(action)}
    />
  );
}
