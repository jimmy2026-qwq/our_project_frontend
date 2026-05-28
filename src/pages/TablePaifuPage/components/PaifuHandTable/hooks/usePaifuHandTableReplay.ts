import { useEffect, useMemo, useState } from 'react';

import type { PaifuRoundSummary, TablePaifuDetail } from '../../../types';
import {
  getReplayActions,
  getReplaySnapshot,
  getReplayStepCount,
  isExhaustiveDrawResultStep,
} from '../../../objects/replay';
import { createScoreDisplays, createTableSticks } from '../objects/PaifuHandTableReplay.helpers';
import { usePaifuOperationFlash } from './usePaifuOperationFlash';
import { usePaifuSettlementAnimation } from './usePaifuSettlementAnimation';

export function usePaifuHandTableReplay({
  paifu,
  round,
  rounds,
  selectedRoundIndex,
}: {
  paifu: TablePaifuDetail;
  round: PaifuRoundSummary;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
}) {
  const [isRoundPickerOpen, setIsRoundPickerOpen] = useState(false);
  const [replayStep, setReplayStep] = useState(0);
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
  const settlement = usePaifuSettlementAnimation({
    hasRoundScoreDelta,
    isExhaustiveDrawResult,
    maxReplayStep,
    replayStep,
    round,
  });
  const operation = usePaifuOperationFlash({
    isExhaustiveDrawResult,
    paifu,
    replayActions,
    replayStep,
    round,
  });
  const scoreDisplays = useMemo(
    () =>
      createScoreDisplays({
        hasRoundScoreDelta,
        paifu,
        replayStep,
        round,
        rounds,
        selectedRoundIndex,
        settlementProgress: settlement.settlementProgress,
      }),
    [
      hasRoundScoreDelta,
      paifu,
      replayStep,
      round,
      rounds,
      selectedRoundIndex,
      settlement.settlementProgress,
    ],
  );
  const tableSticks = useMemo(
    () =>
      createTableSticks({
        replayStep,
        round,
        rounds,
        selectedRoundIndex,
        settlementProgress: settlement.settlementProgress,
      }),
    [replayStep, round, rounds, selectedRoundIndex, settlement.settlementProgress],
  );

  useEffect(() => {
    setReplayStep(0);
    operation.setWinningAction(undefined);
  }, [operation.setWinningAction, round]);

  return {
    activeOperation: operation.activeOperation,
    isExhaustiveDrawResult,
    isRoundPickerOpen,
    maxReplayStep,
    replaySnapshot,
    replayStep,
    scoreDisplays,
    setIsRoundPickerOpen,
    setReplayStep,
    startSettlementAnimation: settlement.startSettlementAnimation,
    tableSticks,
    winningAction: operation.winningAction,
    setWinningAction: operation.setWinningAction,
  };
}
