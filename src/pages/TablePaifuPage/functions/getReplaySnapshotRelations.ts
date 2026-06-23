import type { SeatWind } from '@/objects/tournament';

import { PaifuActionType, type PaifuAction } from '@/objects';
import { replaySeatOrder as seatOrder } from '../objects/replaySeatInfo';

const ClaimRelations = {
  Upper: 'upper',
  Opposite: 'opposite',
  Lower: 'lower',
  Self: 'self',
} as const;

type ClaimRelation = (typeof ClaimRelations)[keyof typeof ClaimRelations];

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
  if (action.actionType === PaifuActionType.Chi) {
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

function getSidewaysIndexByRelation(
  relation: ClaimRelation,
  tileCount: number,
) {
  if (tileCount >= 4) {
    if (relation === ClaimRelations.Upper) {
      return 0;
    }

    if (relation === ClaimRelations.Opposite) {
      return 1;
    }

    if (relation === ClaimRelations.Lower) {
      return 3;
    }
  }

  if (relation === ClaimRelations.Upper) {
    return 0;
  }

  if (relation === ClaimRelations.Opposite) {
    return 1;
  }

  if (relation === ClaimRelations.Lower) {
    return 2;
  }

  return undefined;
}

function getClaimRelation(
  callerSeat: SeatWind,
  claimedSeat: SeatWind,
): ClaimRelation {
  const callerIndex = seatOrder.indexOf(callerSeat);
  const claimedIndex = seatOrder.indexOf(claimedSeat);
  const relation =
    (claimedIndex - callerIndex + seatOrder.length) % seatOrder.length;

  if (relation === 3) {
    return ClaimRelations.Upper;
  }

  if (relation === 2) {
    return ClaimRelations.Opposite;
  }

  if (relation === 1) {
    return ClaimRelations.Lower;
  }

  return ClaimRelations.Self;
}
