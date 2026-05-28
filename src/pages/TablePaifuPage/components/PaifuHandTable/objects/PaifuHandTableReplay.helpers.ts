import type { SeatWind } from '@/objects/tournament';

import type {
  CenterScoreDisplay,
  TableStickDisplay,
} from '../components/CenterTable';
import type { PaifuRoundSummary, TablePaifuDetail } from '../../../types';
import {
  getCurrentRiichiStickCount,
  getPlayerPointsBeforeSettlement,
  getRoundPlayerId,
  seatOrder,
} from '../../../objects/replay';

export const settlementAnimationDurationMs = 1000;
export const settlementAnimationDelayMs = 500;

export function isScoreSettlementRound(round: PaifuRoundSummary) {
  return (
    round.result.outcome === 'ExhaustiveDraw' ||
    round.result.outcome === 'Ron' ||
    round.result.outcome === 'Tsumo'
  );
}

export function createScoreDisplays({
  hasRoundScoreDelta,
  paifu,
  replayStep,
  round,
  rounds,
  selectedRoundIndex,
  settlementProgress,
}: {
  hasRoundScoreDelta: boolean;
  paifu: TablePaifuDetail;
  replayStep: number;
  round: PaifuRoundSummary;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
  settlementProgress?: number;
}) {
  return Object.fromEntries(
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
      const animatedDelta = normalizeZero(Math.round(roundDelta * (1 - progress)));

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
  ) as Record<SeatWind, CenterScoreDisplay>;
}

export function createTableSticks({
  replayStep,
  round,
  rounds,
  selectedRoundIndex,
  settlementProgress,
}: {
  replayStep: number;
  round: PaifuRoundSummary;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
  settlementProgress?: number;
}): TableStickDisplay {
  return {
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
  };
}

function normalizeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}
