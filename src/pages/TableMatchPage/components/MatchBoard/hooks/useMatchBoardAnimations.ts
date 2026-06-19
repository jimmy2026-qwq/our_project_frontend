import type {
  AgariResult,
  MahjongPublicEventView,
  MahjongSeatView,
  SeatWind,
} from '@/objects';
import { useMemo } from 'react';

import {
  createMatchActiveOperation,
  createMatchRiichiCallFlash,
  createMatchWinningCallFlash,
} from '../functions/getMatchBoardCallFlashes';
import { createMatchYakumanTileBurst } from '../functions/getMatchBoardYakumanBurst';

interface UseMatchBoardAnimationsParams {
  event: MahjongPublicEventView | null;
  result: AgariResult | null;
  resultKey: string | null;
  resultWinningCallRemovedKey: string | null;
  resultYakumanBurstActiveKey: string | null;
  seatRotation: Record<SeatWind, SeatWind>;
  seats: MahjongSeatView[];
}

export function useMatchBoardAnimations({
  event,
  result,
  resultKey,
  resultWinningCallRemovedKey,
  resultYakumanBurstActiveKey,
  seatRotation,
  seats,
}: UseMatchBoardAnimationsParams) {
  const activeOperation = useMemo(
    () =>
      createMatchActiveOperation({
        event,
        result,
        seatRotation,
        seats,
      }),
    [event, result, seatRotation, seats],
  );
  const winningCallFlash = useMemo(
    () =>
      createMatchWinningCallFlash({
        result,
        resultKey,
        resultWinningCallRemovedKey,
        seatRotation,
        seats,
      }),
    [result, resultKey, resultWinningCallRemovedKey, seatRotation, seats],
  );
  const riichiCallFlash = useMemo(
    () =>
      createMatchRiichiCallFlash({
        event,
        seatRotation,
        seats,
      }),
    [event, seatRotation, seats],
  );
  const yakumanTileBurst = useMemo(
    () =>
      createMatchYakumanTileBurst({
        result,
        resultKey,
        resultYakumanBurstActiveKey,
        seats,
      }),
    [result, resultKey, resultYakumanBurstActiveKey, seats],
  );

  return {
    activeOperation,
    riichiCallFlash,
    winningCallFlash,
    yakumanTileBurst,
  };
}
