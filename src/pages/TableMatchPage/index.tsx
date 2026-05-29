import { useParams } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';

import {
  TableMatchError,
  TableMatchLoading,
  TableMatchSection,
} from './components';
import { useTableMatchAppealForm } from './hooks/useTableMatchAppealForm';
import { useTableMatchData } from './hooks/useTableMatchData';
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
      isRegisteredPlayer={isRegisteredPlayer}
      operatorId={operatorId}
      canUpdateOwnReady={canUpdateOwnReady}
      canFileAppeal={canFileAppeal}
      isUpdatingOwnReady={readyAction.isUpdatingOwnReady}
      isAppealDialogOpen={appealForm.isAppealDialogOpen}
      appealDescription={appealForm.appealDescription}
      appealError={appealForm.appealError}
      isSubmittingAppeal={appealForm.isSubmittingAppeal}
      onRefresh={forceReload}
      onToggleOwnReady={() => void readyAction.handleToggleOwnReady()}
      onOpenAppeal={appealForm.openAppealDialog}
      onAppealOpenChange={appealForm.setAppealDialogOpen}
      onAppealDescriptionChange={appealForm.setAppealDescription}
      onSubmitAppeal={() => void appealForm.handleSubmitAppeal()}
    />
  );
}
