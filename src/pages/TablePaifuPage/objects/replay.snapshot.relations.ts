import type { SeatWind } from '@/objects/tournament';

import type { PaifuAction } from '../types';
import { seatOrder } from './replay.core';

export function getOpenMeldSidewaysIndex({
  action,
  callerSeat,
  claimedSeat,
  tileCount,
}: {
  action: PaifuAction;
  callerSeat: SeatWind;
  claimedSeat?: SeatWind;
  tileCount: number;
}) {
  if (action.actionType === 'Chi') {
    return 0;
  }

  if (!claimedSeat) {
    return undefined;
  }

  return getSidewaysIndexByRelation(
    getClaimRelation(callerSeat, claimedSeat),
    tileCount,
  );
}

function getSidewaysIndexByRelation(relation: string, tileCount: number) {
  if (tileCount >= 4) {
    if (relation === 'upper') {
      return 0;
    }

    if (relation === 'opposite') {
      return 1;
    }

    if (relation === 'lower') {
      return 3;
    }
  }

  if (relation === 'upper') {
    return 0;
  }

  if (relation === 'opposite') {
    return 1;
  }

  if (relation === 'lower') {
    return 2;
  }

  return undefined;
}

function getClaimRelation(callerSeat: SeatWind, claimedSeat: SeatWind) {
  const callerIndex = seatOrder.indexOf(callerSeat);
  const claimedIndex = seatOrder.indexOf(claimedSeat);
  const relation =
    (claimedIndex - callerIndex + seatOrder.length) % seatOrder.length;

  if (relation === 3) {
    return 'upper';
  }

  if (relation === 2) {
    return 'opposite';
  }

  if (relation === 1) {
    return 'lower';
  }

  return 'self';
}
