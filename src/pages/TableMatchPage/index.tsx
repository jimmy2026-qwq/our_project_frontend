import { TableMatchError, TableMatchLoading } from './components';
import { MatchBoard } from './components/MatchBoard';
import { MahjongBridgeNotice } from './components/TableMatchSection/MahjongBridgeNotice';
import { SeatsOverviewCard } from './components/TableMatchSection/SeatsOverviewCard';
import { TableMatchHeader } from './components/TableMatchSection/TableMatchHeader';
import { useTableMatchPageModel } from './hooks/useTableMatchPageModel';

/** 根据路由加载实时牌桌状态并渲染对局交互页。 */
export function TableMatchPage() {
  const page = useTableMatchPageModel();

  if (page.status.isLoading) {
    return <TableMatchLoading />;
  }

  if (page.status.error || !page.table) {
    return (
      <TableMatchError
        error={page.status.error}
        backLink={page.navigation.backLink}
        onRetry={page.onRefresh}
      />
    );
  }

  return (
    <section className="grid gap-6">
      <TableMatchHeader
        table={page.table}
        backLink={page.navigation.backLink}
        isRefreshing={page.status.isRefreshing}
        canUpdateOwnReady={page.readyAction.canUpdateOwnReady}
        isUpdatingOwnReady={page.readyAction.isUpdatingOwnReady}
        ownSeat={page.seats.ownSeat}
        onRefresh={page.onRefresh}
        onToggleOwnReady={page.readyAction.onToggleOwnReady}
      />

      {page.mahjong.shouldShowMatchBoard && page.mahjong.mahjongTable ? (
        <MatchBoard
          actionError={page.mahjong.actionError}
          finalSettlementTable={page.mahjong.finalSettlementTable}
          isSubmittingAction={page.mahjong.isSubmittingAction}
          mahjongTable={page.mahjong.mahjongTable}
          mahjongAcceptedEvent={page.mahjong.mahjongAcceptedEvent}
          onConfirmFinalSettlement={page.mahjong.onConfirmFinalSettlement}
          onAdvanceRound={page.mahjong.onAdvanceRound}
          onSubmitAction={page.mahjong.onSubmitAction}
          operatorId={page.viewer.playerId}
          playerNames={page.players.names}
          showcaseMode={page.showcaseMode}
          table={page.table}
        />
      ) : (
        <>
          <MahjongBridgeNotice
            error={page.mahjong.error}
            isLoading={page.mahjong.isLoading}
            mahjongTable={page.mahjong.mahjongTable}
          />
          <SeatsOverviewCard
            table={page.table}
            seatMap={page.seats.seatMap}
            ownSeat={page.seats.ownSeat}
            playerNames={page.players.names}
            isRegisteredPlayer={page.viewer.isRegisteredPlayer}
          />
        </>
      )}
    </section>
  );
}
