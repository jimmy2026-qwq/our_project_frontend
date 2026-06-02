import type { MahjongLegalAction, MahjongTableView, SeatWind } from '@/objects';
import type {
  MeldGroup,
  RiverDiscard,
} from '@/pages/TablePaifuPage/objects/ReplaySnapshot.types';
import { PlayerMelds } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PlayerAreas/PlayerMelds';
import { PlayerRiver } from '@/pages/TablePaifuPage/components/PaifuHandTable/components/PlayerAreas/PlayerRiver';
import type { TableDetail } from '@/pages/objects/TournamentViews';

import { MatchActionBar } from './MatchActionBar';
import { MatchCenterTable } from './MatchCenterTable';
import { MatchPlayerHand } from './MatchPlayerHand';

const seatOrder: SeatWind[] = ['East', 'South', 'West', 'North'];

interface MatchBoardProps {
  actionError: string | null;
  isRefreshing: boolean;
  isSubmittingAction: boolean;
  mahjongTable: MahjongTableView;
  onSubmitAction: (action: MahjongLegalAction) => void;
  table: TableDetail;
}

export function MatchBoard({
  actionError,
  isRefreshing,
  isSubmittingAction,
  mahjongTable,
  onSubmitAction,
  table,
}: MatchBoardProps) {
  const seatMap = getMahjongSeatMap(mahjongTable);
  const rivers = getRivers(mahjongTable);
  const melds = getMelds(mahjongTable);
  const discardActions = mahjongTable.legalActions.filter(
    (action) => action.commandType === 'Discard',
  );

  return (
    <section className="grid gap-0">
      <div className="relative min-h-[calc(100vh-12px)] overflow-hidden rounded-[28px] border border-[rgba(176,223,229,0.14)] bg-[radial-gradient(circle_at_50%_42%,rgba(236,197,122,0.2),transparent_18%),radial-gradient(circle_at_72%_72%,rgba(236,197,122,0.22),transparent_16%),linear-gradient(135deg,rgba(32,72,89,0.94),rgba(17,47,66,0.96)_48%,rgba(24,41,84,0.96))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
        <div
          aria-hidden="true"
          className="absolute inset-[7%] rounded-[26px] border border-[rgba(236,197,122,0.2)] shadow-[inset_0_0_90px_rgba(7,18,28,0.42)]"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(236,197,122,0.22)] bg-[radial-gradient(circle,rgba(236,197,122,0.24),transparent_62%)] opacity-80"
        />
        <div className="absolute right-5 top-5 z-[15] grid max-w-[min(28rem,calc(100%-2.5rem))] justify-items-end gap-1 rounded-2xl border border-[rgba(176,223,229,0.18)] bg-[rgba(7,18,28,0.72)] px-4 py-3 text-right shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur">
          <strong className="max-w-full truncate text-sm text-[#f2f7fb]">
            赛事桌 {String(table.tableNo).padStart(2, '0')}
          </strong>
          <span className="max-w-full truncate text-xs font-semibold text-[#c7d6e2]">
            {table.stageId} / v{mahjongTable.version}
            {isRefreshing ? ' / 同步中' : ''}
          </span>
        </div>

        <MatchCenterTable mahjongTable={mahjongTable} />

        {seatOrder.map((seat) => (
          <PlayerRiver key={`${seat}-river`} rivers={rivers} seat={seat} />
        ))}
        {seatOrder.map((seat) => (
          <PlayerMelds key={`${seat}-melds`} melds={melds} seat={seat} />
        ))}
        {seatOrder.map((seat) => (
          <MatchPlayerHand
            key={seat}
            discardActions={discardActions}
            isSubmitting={isSubmittingAction}
            isTurnPlayer={
              mahjongTable.currentRound?.turnPlayerId ===
              seatMap[seat]?.playerId
            }
            onSubmitAction={onSubmitAction}
            seat={seat}
            seatView={seatMap[seat]}
          />
        ))}

        {mahjongTable.currentRound?.pendingCall ? (
          <div className="absolute left-1/2 top-[calc(50%+92px)] z-[16] -translate-x-1/2 rounded-2xl border border-[rgba(236,197,122,0.26)] bg-[rgba(7,18,28,0.78)] px-4 py-2 text-sm font-semibold text-[#ecc57a] shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur">
            等待鸣牌：{mahjongTable.currentRound.pendingCall.tile}
          </div>
        ) : null}

        <MatchActionBar
          actionError={actionError}
          actions={mahjongTable.legalActions}
          isSubmitting={isSubmittingAction}
          onSubmitAction={onSubmitAction}
        />
      </div>
    </section>
  );
}

function getMahjongSeatMap(mahjongTable: MahjongTableView) {
  return seatOrder.reduce(
    (seatMap, seat) => ({
      ...seatMap,
      [seat]: mahjongTable.seats.find((seatView) => seatView.seat === seat) ?? null,
    }),
    {} as Record<SeatWind, MahjongTableView['seats'][number] | null>,
  );
}

function getRivers(mahjongTable: MahjongTableView) {
  return createSeatRecord((seat) => {
    const seatView = mahjongTable.seats.find((item) => item.seat === seat);

    return (
      seatView?.river.map(
        (discard): RiverDiscard => ({
          playerId: discard.playerId,
          sequenceNo: discard.sequenceNo,
          sideways: discard.riichiDeclared || Boolean(discard.calledBy),
          tile: discard.tile,
        }),
      ) ?? []
    );
  });
}

function getMelds(mahjongTable: MahjongTableView) {
  return createSeatRecord((seat) => {
    const seatView = mahjongTable.seats.find((item) => item.seat === seat);

    return (
      seatView?.melds.map(
        (meld): MeldGroup => ({
          actionType: meld.meldType,
          tiles: meld.tiles.map((tile, index) => ({
            concealed: meld.closed && (index === 0 || index === meld.tiles.length - 1),
            sideways: !meld.closed && tile === meld.calledTile,
            tile,
          })),
        }),
      ) ?? []
    );
  });
}

function createSeatRecord<T>(factory: (seat: SeatWind) => T) {
  return seatOrder.reduce(
    (record, seat) => ({
      ...record,
      [seat]: factory(seat),
    }),
    {} as Record<SeatWind, T>,
  );
}
