import type {
  MahjongLegalAction,
  MahjongPublicEventView,
  MahjongTableView,
} from '@/objects';
import type { TableDetail } from '@/pages/objects/TournamentViews';

import type { TableSeat, TableSeatMap } from '../../objects/TableMatch.types';
import { MatchBoard } from '../MatchBoard';
import { SeatsOverviewCard } from './SeatsOverviewCard';
import { TableMatchHeader } from './TableMatchHeader';

interface TableMatchSectionProps {
  table: TableDetail;
  backLink: string;
  seatMap: TableSeatMap;
  ownSeat: TableSeat | null;
  isRefreshing: boolean;
  isMahjongRefreshing: boolean;
  isMahjongLoading: boolean;
  mahjongError: string | null;
  mahjongTable: MahjongTableView | null;
  mahjongAcceptedEvent: MahjongPublicEventView | null;
  playerNames: Record<string, string>;
  showcaseMode: boolean;
  isRegisteredPlayer: boolean;
  operatorId: string;
  canUpdateOwnReady: boolean;
  isUpdatingOwnReady: boolean;
  isSubmittingMahjongAction: boolean;
  mahjongActionError: string | null;
  onRefresh: () => void;
  onToggleOwnReady: () => void;
  onAdvanceRound: () => void;
  onSubmitMahjongAction: (action: MahjongLegalAction) => void;
}

export function TableMatchSection({
  table,
  backLink,
  seatMap,
  ownSeat,
  isRefreshing,
  isMahjongRefreshing,
  isMahjongLoading,
  mahjongError,
  mahjongTable,
  mahjongAcceptedEvent,
  playerNames,
  showcaseMode,
  isRegisteredPlayer,
  operatorId,
  canUpdateOwnReady,
  isUpdatingOwnReady,
  isSubmittingMahjongAction,
  mahjongActionError,
  onRefresh,
  onToggleOwnReady,
  onAdvanceRound,
  onSubmitMahjongAction,
}: TableMatchSectionProps) {
  const shouldShowMatchBoard = Boolean(mahjongTable?.currentRound);

  return (
    <section className="grid gap-6">
      <TableMatchHeader
        table={table}
        backLink={backLink}
        isRefreshing={isRefreshing || isMahjongRefreshing}
        canUpdateOwnReady={canUpdateOwnReady}
        isUpdatingOwnReady={isUpdatingOwnReady}
        ownSeat={ownSeat}
        onRefresh={onRefresh}
        onToggleOwnReady={onToggleOwnReady}
      />

      {shouldShowMatchBoard && mahjongTable ? (
        <MatchBoard
          actionError={mahjongActionError}
          isSubmittingAction={isSubmittingMahjongAction}
          mahjongTable={mahjongTable}
          mahjongAcceptedEvent={mahjongAcceptedEvent}
          onAdvanceRound={onAdvanceRound}
          onSubmitAction={onSubmitMahjongAction}
          operatorId={operatorId}
          playerNames={playerNames}
          showcaseMode={showcaseMode}
          table={table}
        />
      ) : (
        <>
          <MahjongBridgeNotice
            error={mahjongError}
            isLoading={isMahjongLoading}
            mahjongTable={mahjongTable}
          />
          <SeatsOverviewCard
            table={table}
            seatMap={seatMap}
            ownSeat={ownSeat}
            playerNames={playerNames}
            isRegisteredPlayer={isRegisteredPlayer}
          />
        </>
      )}
    </section>
  );
}

function MahjongBridgeNotice({
  error,
  isLoading,
  mahjongTable,
}: {
  error: string | null;
  isLoading: boolean;
  mahjongTable: MahjongTableView | null;
}) {
  if (mahjongTable?.currentRound) {
    return null;
  }

  const message = error
    ? `牌局引擎状态读取失败：${error}`
    : isLoading
      ? '正在读取牌局引擎状态...'
      : mahjongTable
        ? '牌局引擎已连接，等待开局。'
        : '牌局引擎尚未返回状态，当前显示赛事桌候场信息。';

  return (
    <div className="rounded-[22px] border border-[rgba(176,223,229,0.16)] bg-[rgba(7,18,28,0.72)] px-5 py-4 text-sm font-semibold text-[#c7d6e2] shadow-[0_16px_44px_rgba(0,0,0,0.22)]">
      {message}
    </div>
  );
}
