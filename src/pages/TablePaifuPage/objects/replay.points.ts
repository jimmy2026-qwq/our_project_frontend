import type { PaifuRoundSummary, TablePaifuDetail } from '../types';
import {
  getAcceptedRiichiActions,
  getReplaySequenceLimit,
  getReplayStepCount,
  isWinningRound,
} from './replay.core';

function getRoundRiichiPaymentForPlayer(
  round: PaifuRoundSummary,
  playerId: string,
  sequenceLimit = Number.POSITIVE_INFINITY,
) {
  return (
    getAcceptedRiichiActions(round, sequenceLimit).filter(
      (action) => action.actor === playerId,
    ).length * -1000
  );
}

export function getRiichiStickCountBeforeRound(
  rounds: PaifuRoundSummary[],
  selectedRoundIndex: number,
) {
  return rounds.slice(0, selectedRoundIndex).reduce((count, round) => {
    const nextCount = count + getAcceptedRiichiActions(round).length;

    return isWinningRound(round) ? 0 : nextCount;
  }, 0);
}

export function getCurrentRiichiStickCount({
  hasSettlementApplied,
  replayStep,
  round,
  rounds,
  selectedRoundIndex,
}: {
  hasSettlementApplied: boolean;
  replayStep: number;
  round: PaifuRoundSummary;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
}) {
  if (hasSettlementApplied && isWinningRound(round)) {
    return 0;
  }

  return (
    getRiichiStickCountBeforeRound(rounds, selectedRoundIndex) +
    getAcceptedRiichiActions(round, getReplaySequenceLimit(round, replayStep)).length
  );
}

export function getCurrentPlayerPoints({
  paifu,
  playerId,
  replayStep,
  rounds,
  selectedRoundIndex,
}: {
  paifu: TablePaifuDetail;
  playerId: string;
  replayStep: number;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
}) {
  const pointsBeforeSettlement = getPlayerPointsBeforeSettlement({
    paifu,
    playerId,
    replayStep,
    rounds,
    selectedRoundIndex,
  });
  const selectedRound = rounds[selectedRoundIndex];
  const hasCompletedSelectedRound =
    Boolean(selectedRound) &&
    getReplayStepCount(selectedRound) > 0 &&
    replayStep >= getReplayStepCount(selectedRound);

  if (!selectedRound || !hasCompletedSelectedRound) {
    return pointsBeforeSettlement;
  }

  return (
    pointsBeforeSettlement +
    (selectedRound.result.scoreChanges.find((item) => item.playerId === playerId)
      ?.delta ?? 0)
  );
}

export function getPlayerPointsBeforeSettlement({
  paifu,
  playerId,
  replayStep,
  rounds,
  selectedRoundIndex,
}: {
  paifu: TablePaifuDetail;
  playerId: string;
  replayStep: number;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
}) {
  const initialPoints =
    paifu.metadata.seats?.find((item) => item.playerId === playerId)?.initialPoints ??
    0;
  const completedRounds = rounds.slice(0, selectedRoundIndex);
  const selectedRound = rounds[selectedRoundIndex];
  const completedPoints = completedRounds.reduce((total, round) => {
    const scoreChange =
      round.result.scoreChanges.find((item) => item.playerId === playerId)?.delta ??
      0;

    return (
      total +
      scoreChange +
      getRoundRiichiPaymentForPlayer(round, playerId)
    );
  }, initialPoints);

  if (!selectedRound) {
    return completedPoints;
  }

  return (
    completedPoints +
    getRoundRiichiPaymentForPlayer(
      selectedRound,
      playerId,
      getReplaySequenceLimit(selectedRound, replayStep),
    )
  );
}
