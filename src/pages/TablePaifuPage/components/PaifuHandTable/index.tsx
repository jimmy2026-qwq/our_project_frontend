import { useEffect, useMemo, useState } from 'react';
import type { SeatWind } from '@/objects/tournament';

import type { PaifuRoundSummary, TablePaifuDetail } from '../../types';
import {
  getPlayerDisplayName,
  getRoundPlayerId,
  isPlayerTenpai,
  seatOrder,
} from '../../functions/getReplay';
import { CenterTable, RoundPicker } from './components/CenterTable';
import { ExhaustiveDrawStatusMarkers } from './components/PaifuOverlays/ExhaustiveDrawStatusMarkers';
import { OperationFlash } from './components/PaifuOverlays/OperationFlash';
import { WinningCallFlash } from './components/PaifuOverlays/WinningCallFlash';
import { WinningResultOverlay } from './components/PaifuOverlays/WinningResultOverlay';
import { PlayerHand } from './components/PlayerAreas/PlayerHand';
import { PlayerMelds } from './components/PlayerAreas/PlayerMelds';
import { PlayerRiver } from './components/PlayerAreas/PlayerRiver';
import { ReplayControls } from './components/ReplayControls';
import { useMahjongTileImagePreload } from './components/TileImagePreload';
import { usePaifuHandTableReplay } from './hooks/usePaifuHandTableReplay';

interface PaifuHandTableProps {
  onSelectRound: (index: number) => void;
  paifu: TablePaifuDetail;
  round: PaifuRoundSummary;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
  viewerPlayerId: string;
}

type HandVisibilityMode = 'self' | 'all';

export function PaifuHandTable({
  onSelectRound,
  paifu,
  round,
  rounds,
  selectedRoundIndex,
  viewerPlayerId,
}: PaifuHandTableProps) {
  useMahjongTileImagePreload();
  const [handVisibilityMode, setHandVisibilityMode] =
    useState<HandVisibilityMode>('self');
  const [perspectiveSeat, setPerspectiveSeat] = useState<SeatWind>(() =>
    getInitialPerspectiveSeat(paifu, viewerPlayerId),
  );

  useEffect(() => {
    setPerspectiveSeat(getInitialPerspectiveSeat(paifu, viewerPlayerId));
  }, [paifu.id, viewerPlayerId]);

  const displayPaifu = useMemo(
    () => createPerspectivePaifu(paifu, perspectiveSeat),
    [paifu, perspectiveSeat],
  );

  const replay = usePaifuHandTableReplay({
    paifu: displayPaifu,
    round,
    rounds,
    selectedRoundIndex,
  });
  const selfPlayerId = getRoundPlayerId(displayPaifu, 'East');
  const perspectiveLabel = selfPlayerId
    ? `视角：${getPlayerDisplayName(displayPaifu, selfPlayerId)}`
    : '视角：东家';

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
            {paifu.metadata.tournamentName ?? paifu.metadata.tournamentId}
          </strong>
          <span className="max-w-full truncate text-xs font-semibold text-[#c7d6e2]">
            {paifu.metadata.stageName ?? paifu.metadata.stageId}
          </span>
        </div>

        <CenterTable
          isExhaustiveDrawResult={replay.isExhaustiveDrawResult}
          isRoundPickerOpen={replay.isRoundPickerOpen}
          onToggleRoundPicker={() =>
            replay.setIsRoundPickerOpen((value) => !value)
          }
          paifu={displayPaifu}
          replayStep={replay.replayStep}
          round={round}
          scoreDisplays={replay.scoreDisplays}
          tableSticks={replay.tableSticks}
        />

        {seatOrder.map((seat) => (
          <PlayerRiver
            key={`${seat}-river`}
            rivers={replay.replaySnapshot.rivers}
            seat={seat}
          />
        ))}
        {seatOrder.map((seat) => (
          <PlayerMelds
            key={`${seat}-melds`}
            melds={replay.replaySnapshot.melds}
            seat={seat}
          />
        ))}
        {replay.isExhaustiveDrawResult ? (
          <ExhaustiveDrawStatusMarkers paifu={displayPaifu} round={round} />
        ) : (
          <>
            <OperationFlash operation={replay.activeOperation} />
            <WinningCallFlash flash={replay.activeWinningCall} />
          </>
        )}

        {replay.isRoundPickerOpen ? (
          <RoundPicker
            onSelectRound={(index) => {
              onSelectRound(index);
              replay.setIsRoundPickerOpen(false);
            }}
            rounds={rounds}
            selectedRoundIndex={selectedRoundIndex}
          />
        ) : null}

        <ReplayControls
          handVisibilityLabel={
            handVisibilityMode === 'self' ? '只亮自家' : '亮四家'
          }
          maxReplayStep={replay.maxReplayStep}
          onBackward={() =>
            replay.setReplayStep((value) => Math.max(0, value - 1))
          }
          onCyclePerspective={() =>
            setPerspectiveSeat((seat) => getNextPerspectiveSeat(paifu, seat))
          }
          onForward={() =>
            replay.setReplayStep((value) =>
              Math.min(replay.maxReplayStep, value + 1),
            )
          }
          onToggleHandVisibility={() =>
            setHandVisibilityMode((mode) => (mode === 'self' ? 'all' : 'self'))
          }
          perspectiveLabel={perspectiveLabel}
          replayStep={replay.replayStep}
        />

        {seatOrder.map((seat) => (
          <PlayerHand
            key={seat}
            drawnTileIndex={
              replay.replaySnapshot.drawnTileIndexes[
                getRoundPlayerId(displayPaifu, seat)
              ]
            }
            hands={replay.replaySnapshot.hands}
            paifu={displayPaifu}
            seat={seat}
            shouldRevealHand={shouldRevealPaifuHand({
              handVisibilityMode,
              isExhaustiveDrawResult: replay.isExhaustiveDrawResult,
              playerId: getRoundPlayerId(displayPaifu, seat),
              revealedWinningPlayerId: replay.revealedWinningPlayerId,
              round,
              selfPlayerId,
            })}
          />
        ))}

        {replay.winningAction ? (
          <WinningResultOverlay
            action={replay.winningAction}
            onConfirm={() => {
              replay.clearWinningAction();
              replay.startSettlementAnimation();
            }}
            playerNames={displayPaifu.metadata.playerNames ?? {}}
            replaySnapshot={replay.replaySnapshot}
            replayStep={replay.replayStep}
            round={round}
          />
        ) : null}
      </div>
    </section>
  );
}

function shouldRevealPaifuHand({
  handVisibilityMode,
  isExhaustiveDrawResult,
  playerId,
  revealedWinningPlayerId,
  round,
  selfPlayerId,
}: {
  handVisibilityMode: HandVisibilityMode;
  isExhaustiveDrawResult: boolean;
  playerId: string;
  revealedWinningPlayerId?: string;
  round: PaifuRoundSummary;
  selfPlayerId: string;
}) {
  if (!playerId) {
    return false;
  }

  if (handVisibilityMode === 'all') {
    return true;
  }

  return (
    playerId === selfPlayerId ||
    playerId === revealedWinningPlayerId ||
    (isExhaustiveDrawResult && isPlayerTenpai(round, playerId))
  );
}

function getInitialPerspectiveSeat(
  paifu: TablePaifuDetail,
  viewerPlayerId: string,
): SeatWind {
  const viewerSeat = paifu.metadata.seats?.find(
    (seat) => seat.playerId === viewerPlayerId,
  )?.seat;

  return viewerSeat ?? firstOccupiedSeat(paifu) ?? 'East';
}

function getNextPerspectiveSeat(
  paifu: TablePaifuDetail,
  currentSeat: SeatWind,
): SeatWind {
  const occupiedSeats = seatOrder.filter((seat) =>
    paifu.metadata.seats?.some((item) => item.seat === seat),
  );
  const selectableSeats = occupiedSeats.length > 0 ? occupiedSeats : seatOrder;
  const currentIndex = selectableSeats.indexOf(currentSeat);

  return selectableSeats[
    (Math.max(0, currentIndex) + 1) % selectableSeats.length
  ];
}

function firstOccupiedSeat(paifu: TablePaifuDetail) {
  return seatOrder.find((seat) =>
    paifu.metadata.seats?.some((item) => item.seat === seat),
  );
}

function createPerspectivePaifu(
  paifu: TablePaifuDetail,
  perspectiveSeat: SeatWind,
): TablePaifuDetail {
  const seatRotation = createSeatRotation(perspectiveSeat);

  return {
    ...paifu,
    metadata: {
      ...paifu.metadata,
      seats: paifu.metadata.seats?.map((seat) => ({
        ...seat,
        seat: seatRotation[seat.seat],
      })),
    },
    finalStandings: paifu.finalStandings.map((standing) => ({
      ...standing,
      seat: seatRotation[standing.seat],
    })),
  };
}

function createSeatRotation(viewerSeat: SeatWind): Record<SeatWind, SeatWind> {
  const viewerIndex = seatOrder.indexOf(viewerSeat);

  return seatOrder.reduce(
    (rotation, actualSeat, actualIndex) => ({
      ...rotation,
      [actualSeat]:
        seatOrder[
          (actualIndex - viewerIndex + seatOrder.length) % seatOrder.length
        ],
    }),
    {} as Record<SeatWind, SeatWind>,
  );
}
