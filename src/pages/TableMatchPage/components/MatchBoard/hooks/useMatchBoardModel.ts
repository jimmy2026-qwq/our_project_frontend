import type { MahjongLegalAction } from '@/objects';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isWinOutcome } from '@/components/mahjong-result/functions/getMahjongResultSequence';

import { getCurrentRoundKey, getResultKey, getTurnActionDelayKey } from '../functions/getMatchBoardKeys';
import { getMatchBoardActionState } from '../functions/getMatchBoardActionState';
import {
  createMatchScoreDisplays,
  shouldCompleteTableAfterCurrentResult,
} from '../functions/getMatchBoardSettlement';
import {
  getMahjongSeatMap,
  getMelds,
  getRivers,
} from '../functions/getMatchBoardSeats';
import { getSeatRotation } from '../functions/getMatchBoardSeatRotation';
import type { MatchBoardProps } from '../objects/MatchBoardProps';
import { useMatchBoardAnimations } from './useMatchBoardAnimations';
import { useMatchResultSequence } from './useMatchResultSequence';
import { usePendingMahjongTableSync } from './usePendingMahjongTableSync';
import { useTurnActionDelay } from './useTurnActionDelay';

export function useMatchBoardModel({
  actionError,
  finalSettlementTable,
  isSubmittingAction,
  mahjongAcceptedEvent,
  mahjongTable: latestMahjongTable,
  onConfirmFinalSettlement,
  onAdvanceRound,
  onSubmitAction,
  operatorId,
  playerNames,
  showcaseMode,
  table,
}: MatchBoardProps) {
  const [displayedMahjongTable, setDisplayedMahjongTable] =
    useState(latestMahjongTable);
  const mahjongTable = displayedMahjongTable;
  const result = mahjongTable.currentRound?.result ?? null;
  const seatRotation = getSeatRotation(mahjongTable, operatorId);
  const seatMap = getMahjongSeatMap(mahjongTable, seatRotation);
  const rivers = getRivers(mahjongTable, seatRotation);
  const melds = getMelds(mahjongTable, seatRotation);
  const legalActions = mahjongTable.legalActions ?? [];
  const roundKey = getCurrentRoundKey(mahjongTable);
  const turnActionDelayKey = getTurnActionDelayKey(mahjongTable, operatorId);
  const resultKey = getResultKey(mahjongTable);
  const [isRiichiSelectionActive, setIsRiichiSelectionActive] = useState(false);
  const [isRelativeScoreMode, setIsRelativeScoreMode] = useState(false);
  const seats = useMemo(() => mahjongTable.seats ?? [], [mahjongTable.seats]);
  const winResultNeedsSequence = Boolean(
    result && isWinOutcome(result.outcome),
  );
  const isCurrentEastPlayer = seats.some(
    (seat) => seat.seat === 'East' && seat.playerId === operatorId,
  );
  const terminalSettlementTable =
    finalSettlementTable ??
    (mahjongTable.status === 'Finished' || mahjongTable.status === 'Archived'
      ? mahjongTable
      : null);
  const canAdvanceAfterSettlement =
    !terminalSettlementTable &&
    table.status !== 'Archived' &&
    mahjongTable.status !== 'Archived' &&
    mahjongTable.status !== 'Finished';
  const resultSequence = useMatchResultSequence({
    canAdvanceAfterSettlement,
    isCurrentEastPlayer,
    onAdvanceRound,
    result,
    resultKey,
    seats,
    winResultNeedsSequence,
  });
  const isLocalSettlementDisplayActive = Boolean(
    resultKey &&
      result &&
      (resultSequence.resultSequenceCompletedKey !== resultKey ||
        resultSequence.settlementProgress === undefined ||
        resultSequence.settlementProgress < 1),
  );
  const shouldShowResult = Boolean(
    result &&
      resultKey &&
      (!winResultNeedsSequence ||
        resultSequence.resultOverlayReadyKey === resultKey) &&
      resultSequence.resultSequenceCompletedKey !== resultKey &&
      resultSequence.settlementAnimatingKey !== resultKey,
  );
  const scoreDisplays = useMemo(
    () =>
      createMatchScoreDisplays({
        result,
        seatsByDisplaySeat: seatMap,
        settlementProgress: resultSequence.settlementProgress,
      }),
    [result, seatMap, resultSequence.settlementProgress],
  );
  const scoreStepActionLabel =
    table.status === 'Archived' || mahjongTable.status === 'Archived'
      ? '关闭结算'
      : shouldCompleteTableAfterCurrentResult(mahjongTable)
        ? '完成牌桌'
        : '进入下一局';

  usePendingMahjongTableSync({
    isLocalSettlementDisplayActive,
    latestMahjongTable,
    setDisplayedMahjongTable,
  });

  const delayedTurnActionKey = useTurnActionDelay(turnActionDelayKey);
  const isTurnActionDelayActive = Boolean(
    turnActionDelayKey && delayedTurnActionKey === turnActionDelayKey,
  );
  const actionState = getMatchBoardActionState({
    isTurnActionDelayActive,
    legalActions,
  });
  const displayedTurnPlayerId = isTurnActionDelayActive
    ? null
    : mahjongTable.currentRound?.turnPlayerId;
  const submitActionAndClosePickers = useCallback(
    (action: MahjongLegalAction) => {
      setIsRiichiSelectionActive(false);
      onSubmitAction(action);
    },
    [onSubmitAction],
  );

  useEffect(() => {
    if (actionState.riichiActions.length === 0) {
      setIsRiichiSelectionActive(false);
    }
  }, [actionState.riichiActions.length]);

  useEffect(() => {
    setIsRelativeScoreMode(false);
  }, [roundKey]);

  useEffect(() => {
    if (resultSequence.settlementProgress !== undefined) {
      setIsRelativeScoreMode(false);
    }
  }, [resultSequence.settlementProgress]);

  const animations = useMatchBoardAnimations({
    event: mahjongAcceptedEvent,
    result,
    resultKey,
    resultWinningCallRemovedKey: resultSequence.resultWinningCallRemovedKey,
    resultYakumanBurstActiveKey: resultSequence.resultYakumanBurstActiveKey,
    seatRotation,
    seats,
  });
  const toggleRelativeScoreMode = useCallback(() => {
    setIsRelativeScoreMode((value) => !value);
  }, []);
  const toggleRiichiSelection = useCallback(() => {
    setIsRiichiSelectionActive((value) => !value);
  }, []);

  return {
    actionError,
    ...animations,
    ...actionState,
    ...resultSequence,
    displayedTurnPlayerId,
    isLocalSettlementDisplayActive,
    isRelativeScoreMode,
    isRiichiSelectionActive,
    isSubmittingAction,
    mahjongTable,
    melds,
    onConfirmFinalSettlement,
    operatorId,
    playerNames,
    resultKey,
    riichiSelectionPlayerId: mahjongTable.currentRound?.turnPlayerId,
    rivers,
    scoreDisplays,
    scoreStepActionLabel,
    seatMap,
    seats,
    shouldShowResult,
    showcaseMode,
    submitActionAndClosePickers,
    table,
    terminalSettlementTable,
    toggleRelativeScoreMode,
    toggleRiichiSelection,
    winResultNeedsSequence,
  };
}

export type MatchBoardModel = ReturnType<typeof useMatchBoardModel>;
