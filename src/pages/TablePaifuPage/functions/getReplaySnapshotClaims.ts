import type { SeatWind } from '@/objects/tournament';

import type { PaifuAction, TablePaifuDetail } from '../types';
import type { RiverDiscard } from '../objects/ReplaySnapshot.types';
import { seatOrder } from './getReplayCore';
import { getPlayerSeat } from './getReplayPlayers';

export function claimDiscard({
  action,
  callerSeat,
  paifu,
  rivers,
}: {
  action: PaifuAction;
  callerSeat: SeatWind;
  paifu: TablePaifuDetail;
  rivers: Record<SeatWind, RiverDiscard[]>;
}) {
  const explicitClaim = claimExplicitDiscard({ action, paifu, rivers });

  if (explicitClaim) {
    return explicitClaim;
  }

  return claimLegacyDiscard(rivers, callerSeat, action.tile);
}

function claimExplicitDiscard({
  action,
  paifu,
  rivers,
}: {
  action: PaifuAction;
  paifu: TablePaifuDetail;
  rivers: Record<SeatWind, RiverDiscard[]>;
}) {
  if (action.targetSequenceNo) {
    return claimDiscardBySequenceNo(rivers, action.targetSequenceNo);
  }

  if (action.fromPlayer && action.tile) {
    const fromSeat = getPlayerSeat(paifu, action.fromPlayer);

    return fromSeat
      ? claimDiscardFromSeat(rivers, fromSeat, action.tile)
      : undefined;
  }

  return undefined;
}

function claimDiscardBySequenceNo(
  rivers: Record<SeatWind, RiverDiscard[]>,
  targetSequenceNo: number,
) {
  for (const seat of seatOrder) {
    const river = rivers[seat];
    const claimedIndex = river.findIndex(
      (discard) => discard.sequenceNo === targetSequenceNo,
    );

    if (claimedIndex >= 0) {
      return removeClaimedDiscard(rivers, seat, claimedIndex);
    }
  }

  return undefined;
}

function claimDiscardFromSeat(
  rivers: Record<SeatWind, RiverDiscard[]>,
  seat: SeatWind,
  tile: string,
) {
  const claimedIndex = findLastDiscardIndex(rivers[seat], tile);

  return claimedIndex >= 0
    ? removeClaimedDiscard(rivers, seat, claimedIndex)
    : undefined;
}

function claimLegacyDiscard(
  rivers: Record<SeatWind, RiverDiscard[]>,
  callerSeat: SeatWind,
  tile?: string,
) {
  if (!tile) {
    return undefined;
  }

  for (const seat of seatOrder) {
    if (seat === callerSeat) {
      continue;
    }

    const claimed = claimDiscardFromSeat(rivers, seat, tile);

    if (claimed) {
      return claimed;
    }
  }

  return undefined;
}

function removeClaimedDiscard(
  rivers: Record<SeatWind, RiverDiscard[]>,
  seat: SeatWind,
  claimedIndex: number,
) {
  const [discard] = rivers[seat].slice(claimedIndex, claimedIndex + 1);
  rivers[seat] = rivers[seat].filter((_, index) => index !== claimedIndex);

  return discard ? { discard, seat } : undefined;
}

function findLastDiscardIndex(river: RiverDiscard[], tile: string) {
  for (let index = river.length - 1; index >= 0; index -= 1) {
    if (river[index]?.tile === tile) {
      return index;
    }
  }

  return -1;
}
