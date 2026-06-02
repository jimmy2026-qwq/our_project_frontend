import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { useRealtimeRefresh } from '@/app/realtime/useRealtimeRefresh';

import {
  TableMatchError,
  TableMatchLoading,
  TableMatchSection,
} from './components';
import { useTableMatchAppealForm } from './hooks/useTableMatchAppealForm';
import { useTableMatchData } from './hooks/useTableMatchData';
import { useTableMatchMahjongState } from './hooks/useTableMatchMahjongState';
import { useTableMatchReadyAction } from './hooks/useTableMatchReadyAction';
import { useTableMatchSeatState } from './hooks/useTableMatchSeatState';

export function TableMatchPage() {
  const { tableId = '' } = useParams();
  const { session } = useAuth();
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
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
  const { seatMap, ownSeat, canUpdateOwnReady, canFileAppeal } =
    useTableMatchSeatState(table, operatorId, isRegisteredPlayer);
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
  });
  const handleRefresh = useCallback(() => {
    forceReload();
    mahjongState.reload();
  }, [forceReload, mahjongState]);
  useRealtimeRefresh(
    ['TournamentTableChanged', 'MahjongTableChanged', 'AppealChanged'],
    handleRefresh,
  );
  const appealForm = useTableMatchAppealForm({
    table,
    ownSeat,
    operatorId,
    forceReload,
  });
  const backLink = table?.tournamentId
    ? `/public/tournaments/${table.tournamentId}`
    : '/public';

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
      mahjongTable={mahjongState.mahjongTable}
      isRegisteredPlayer={isRegisteredPlayer}
      operatorId={operatorId}
      canUpdateOwnReady={canUpdateOwnReady}
      canFileAppeal={canFileAppeal}
      isUpdatingOwnReady={readyAction.isUpdatingOwnReady}
      isSubmittingMahjongAction={mahjongState.isSubmittingAction}
      mahjongActionError={mahjongState.actionError}
      isAppealDialogOpen={appealForm.isAppealDialogOpen}
      appealDescription={appealForm.appealDescription}
      appealError={appealForm.appealError}
      isSubmittingAppeal={appealForm.isSubmittingAppeal}
      onRefresh={handleRefresh}
      onToggleOwnReady={() => void readyAction.handleToggleOwnReady()}
      onSubmitMahjongAction={(action) => void mahjongState.submitAction(action)}
      onOpenAppeal={appealForm.openAppealDialog}
      onAppealOpenChange={appealForm.setAppealDialogOpen}
      onAppealDescriptionChange={appealForm.setAppealDescription}
      onSubmitAppeal={() => void appealForm.handleSubmitAppeal()}
    />
  );
}
