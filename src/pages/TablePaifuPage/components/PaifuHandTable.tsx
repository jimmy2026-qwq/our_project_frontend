import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { SeatWind } from '@/objects/tournament';

import type { PaifuAction, PaifuRoundSummary, TablePaifuDetail } from '../types';
import {
  getCurrentRiichiStickCount,
  getOperationText,
  getPlayerPointsBeforeSettlement,
  getPlayerSeat,
  getReplayActions,
  getReplaySnapshot,
  getReplayStepCount,
  getRoundPlayerId,
  isAbortiveDrawAction,
  isExhaustiveDrawResultStep,
  isWinningAction,
  seatOrder,
} from '../objects/replay';
import { CenterTable, RoundPicker } from './CenterTable';
import {
  ExhaustiveDrawStatusMarkers,
  OperationFlash,
  WinningResultOverlay,
  type ActiveOperation,
} from './PaifuOverlays';
import { PlayerHand, PlayerMelds, PlayerRiver } from './PlayerAreas';
import { ReplayControls } from './ReplayControls';

const settlementAnimationDurationMs = 1000;
const settlementAnimationDelayMs = 500;

function isScoreSettlementRound(round: PaifuRoundSummary) {
  return (
    round.result.outcome === 'ExhaustiveDraw' ||
    round.result.outcome === 'Ron' ||
    round.result.outcome === 'Tsumo'
  );
}

function normalizeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

export function PaifuHandTable({
  onSelectRound,
  paifu,
  round,
  rounds,
  selectedRoundIndex,
}: {
  onSelectRound: (index: number) => void;
  paifu: TablePaifuDetail;
  round: PaifuRoundSummary;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
}) {
  const [isRoundPickerOpen, setIsRoundPickerOpen] = useState(false);
  const [replayStep, setReplayStep] = useState(0);
  const [activeOperation, setActiveOperation] = useState<
    ActiveOperation | undefined
  >();
  const [winningAction, setWinningAction] = useState<PaifuAction | undefined>();
  const [settlementProgress, setSettlementProgress] = useState<
    number | undefined
  >();
  const animationFrameRef = useRef<number | undefined>(undefined);
  const replayActions = useMemo(() => getReplayActions(round), [round]);
  const maxReplayStep = useMemo(() => getReplayStepCount(round), [round]);
  const isExhaustiveDrawResult = isExhaustiveDrawResultStep(round, replayStep);
  const replaySnapshot = useMemo(
    () => getReplaySnapshot(paifu, round, replayStep),
    [paifu, replayStep, round],
  );
  const hasRoundScoreDelta = useMemo(
    () => round.result.scoreChanges.some((scoreChange) => scoreChange.delta !== 0),
    [round],
  );
  const scoreDisplays = useMemo(
    () =>
      Object.fromEntries(
        seatOrder.map((seat) => {
          const playerId = getRoundPlayerId(paifu, seat);
          const basePoints = playerId
            ? getPlayerPointsBeforeSettlement({
                paifu,
                playerId,
                replayStep,
                rounds,
                selectedRoundIndex,
              })
            : 0;
          const roundDelta =
            round.result.scoreChanges.find((item) => item.playerId === playerId)
              ?.delta ?? 0;
          const progress = settlementProgress ?? 0;
          const animatedDelta = normalizeZero(
            Math.round(roundDelta * (1 - progress)),
          );

          return [
            seat,
            {
              delta: animatedDelta,
              points: basePoints + Math.round(roundDelta * progress),
              showDelta:
                isScoreSettlementRound(round) &&
                hasRoundScoreDelta &&
                settlementProgress !== undefined &&
                progress < 1,
            },
          ];
        }),
      ) as Record<
        SeatWind,
        { delta: number; points: number; showDelta: boolean }
      >,
    [
      hasRoundScoreDelta,
      paifu,
      replayStep,
      round,
      rounds,
      selectedRoundIndex,
      settlementProgress,
    ],
  );
  const tableSticks = useMemo(
    () => ({
      // Honba is a paifu round descriptor supplied by the backend/game engine.
      honba: round.descriptor.honba,
      riichi: getCurrentRiichiStickCount({
        hasSettlementApplied:
          (round.result.outcome === 'Ron' || round.result.outcome === 'Tsumo') &&
          settlementProgress !== undefined,
        replayStep,
        round,
        rounds,
        selectedRoundIndex,
      }),
    }),
    [replayStep, round, rounds, selectedRoundIndex, settlementProgress],
  );

  const stopSettlementAnimation = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  }, []);

  const startSettlementAnimation = useCallback(() => {
    if (!isScoreSettlementRound(round) || !hasRoundScoreDelta) {
      return;
    }

    stopSettlementAnimation();
    setSettlementProgress(0);

    const startedAt = window.performance.now();

    const animate = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(
        1,
        Math.max(0, elapsed - settlementAnimationDelayMs) /
          settlementAnimationDurationMs,
      );

      setSettlementProgress(progress);

      if (elapsed < settlementAnimationDelayMs + settlementAnimationDurationMs) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = undefined;
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
  }, [hasRoundScoreDelta, round, stopSettlementAnimation]);

  useEffect(() => {
    stopSettlementAnimation();
    setReplayStep(0);
    setActiveOperation(undefined);
    setSettlementProgress(undefined);
    setWinningAction(undefined);
  }, [round, stopSettlementAnimation]);

  useEffect(
    () => () => {
      stopSettlementAnimation();
    },
    [stopSettlementAnimation],
  );

  useEffect(() => {
    const shouldKeepSettlement =
      (round.result.outcome === 'ExhaustiveDraw' && isExhaustiveDrawResult) ||
      ((round.result.outcome === 'Ron' || round.result.outcome === 'Tsumo') &&
        settlementProgress !== undefined &&
        replayStep >= maxReplayStep);

    if (!shouldKeepSettlement && settlementProgress !== undefined) {
      stopSettlementAnimation();
      setSettlementProgress(undefined);
    }
  }, [
    isExhaustiveDrawResult,
    maxReplayStep,
    replayStep,
    round.result.outcome,
    settlementProgress,
    stopSettlementAnimation,
  ]);

  useEffect(() => {
    if (
      round.result.outcome === 'ExhaustiveDraw' &&
      isExhaustiveDrawResult &&
      settlementProgress === undefined
    ) {
      startSettlementAnimation();
    }
  }, [
    isExhaustiveDrawResult,
    round.result.outcome,
    settlementProgress,
    startSettlementAnimation,
  ]);

  useEffect(() => {
    if (replayStep <= 0 || isExhaustiveDrawResult) {
      setActiveOperation(undefined);
      setWinningAction(undefined);
      return;
    }

    const action = replayActions[replayStep - 1];
    const label = action ? getOperationText(action, round) : undefined;
    const seat = action?.actor ? getPlayerSeat(paifu, action.actor) : undefined;

    if (!label || !seat) {
      setActiveOperation(undefined);
      setWinningAction(undefined);
      return;
    }

    setWinningAction(undefined);
    setActiveOperation({ key: Date.now(), label, seat: seat as SeatWind });

    if (isAbortiveDrawAction(action)) {
      return;
    }

    if (isWinningAction(action)) {
      const timeoutId = window.setTimeout(() => {
        setActiveOperation(undefined);
        setWinningAction(action);
      }, 1000);

      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      setActiveOperation(undefined);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [isExhaustiveDrawResult, paifu, replayActions, replayStep, round]);

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
          isExhaustiveDrawResult={isExhaustiveDrawResult}
          isRoundPickerOpen={isRoundPickerOpen}
          onToggleRoundPicker={() => setIsRoundPickerOpen((value) => !value)}
          paifu={paifu}
          replayStep={replayStep}
          round={round}
          scoreDisplays={scoreDisplays}
          tableSticks={tableSticks}
        />

        {seatOrder.map((seat) => (
          <PlayerRiver
            key={`${seat}-river`}
            rivers={replaySnapshot.rivers}
            seat={seat}
          />
        ))}
        {seatOrder.map((seat) => (
          <PlayerMelds
            key={`${seat}-melds`}
            melds={replaySnapshot.melds}
            seat={seat}
          />
        ))}
        {isExhaustiveDrawResult ? (
          <ExhaustiveDrawStatusMarkers paifu={paifu} round={round} />
        ) : (
          <OperationFlash operation={activeOperation} />
        )}

        {isRoundPickerOpen ? (
          <RoundPicker
            onSelectRound={(index) => {
              onSelectRound(index);
              setIsRoundPickerOpen(false);
            }}
            rounds={rounds}
            selectedRoundIndex={selectedRoundIndex}
          />
        ) : null}

        <ReplayControls
          maxReplayStep={maxReplayStep}
          onBackward={() => setReplayStep((value) => Math.max(0, value - 1))}
          onForward={() =>
            setReplayStep((value) => Math.min(maxReplayStep, value + 1))
          }
          replayStep={replayStep}
        />

        {seatOrder.map((seat) => (
          <PlayerHand
            key={seat}
            drawnTileIndex={
              replaySnapshot.drawnTileIndexes[getRoundPlayerId(paifu, seat)]
            }
            isExhaustiveDrawResult={isExhaustiveDrawResult}
            hands={replaySnapshot.hands}
            paifu={paifu}
            round={round}
            seat={seat}
          />
        ))}

        {winningAction ? (
          <WinningResultOverlay
            action={winningAction}
            onConfirm={() => {
              setWinningAction(undefined);
              startSettlementAnimation();
            }}
            replaySnapshot={replaySnapshot}
            replayStep={replayStep}
            round={round}
          />
        ) : null}
      </div>
    </section>
  );
}
