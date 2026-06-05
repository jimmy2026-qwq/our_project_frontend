import type { SeatWind } from '@/objects/tournament';

import type { PaifuRoundSummary, TablePaifuDetail } from '../types';
import { getReplaySequenceLimit } from './getReplayCore';
import { applySnapshotAction } from './applyReplaySnapshot';
import type { MeldGroup, RiverDiscard } from '../objects/ReplaySnapshot.types';

export type {
  MeldGroup,
  MeldTile,
  RiverDiscard,
} from '../objects/ReplaySnapshot.types';

export function getReplaySnapshot(
  paifu: TablePaifuDetail,
  round: PaifuRoundSummary,
  replayStep: number,
) {
  const hands = createInitialHands(round);
  const rivers = createEmptySeatRecord<RiverDiscard[]>(() => []);
  const melds = createEmptySeatRecord<MeldGroup[]>(() => []);
  const pendingRiichiSideways = createEmptySeatRecord<boolean>(() => false);
  const drawnTileIndexes: Record<string, number | undefined> = {};
  const sequenceLimit = getReplaySequenceLimit(round, replayStep);

  round.actions
    .filter((action) => action.sequenceNo <= sequenceLimit)
    .forEach((action) => {
      applySnapshotAction({
        action,
        drawnTileIndexes,
        hands,
        melds,
        paifu,
        pendingRiichiSideways,
        round,
        rivers,
      });
    });

  return { drawnTileIndexes, hands, melds, rivers };
}

function createInitialHands(round: PaifuRoundSummary) {
  return Object.fromEntries(
    Object.entries(round.initialHands).map(([playerId, tiles]) => [
      playerId,
      [...tiles],
    ]),
  );
}

function createEmptySeatRecord<T>(createValue: () => T) {
  return {
    East: createValue(),
    South: createValue(),
    West: createValue(),
    North: createValue(),
  } as Record<SeatWind, T>;
}
