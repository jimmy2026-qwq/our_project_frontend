import type {
  PaifuAction,
  PaifuRound as PaifuRoundSummary,
  PaifuTile,
} from '@/objects';
import { removeFirstTile } from './getReplayCore';
import { getAddedTileIndex } from './getReplaySnapshotHands';

export function applyHandSnapshot(
  action: PaifuAction,
  hands: Record<string, PaifuTile[]>,
  drawnTileIndexes: Record<string, number | undefined>,
  round: PaifuRoundSummary,
) {
  if (!action.actor) {
    return;
  }

  if (action.actionType === 'Draw' && action.handTilesAfterAction) {
    const beforeTiles = hands[action.actor] ?? [];
    const afterTiles = [...action.handTilesAfterAction];

    hands[action.actor] = afterTiles;
    drawnTileIndexes[action.actor] = getAddedTileIndex({
      afterTiles,
      beforeTiles,
      preferredTile: action.tile ?? undefined,
    });
  } else if (action.handTilesAfterAction) {
    hands[action.actor] = getVisibleHandTilesAfterAction({
      action,
      currentTiles: hands[action.actor] ?? [],
      round,
    });
  }
}

function getVisibleHandTilesAfterAction({
  action,
  currentTiles,
  round,
}: {
  action: PaifuAction;
  currentTiles: PaifuTile[];
  round: PaifuRoundSummary;
}) {
  const afterTiles = [...(action.handTilesAfterAction ?? [])];

  if (
    action.actionType !== 'Win' ||
    round.result.outcome !== 'Ron' ||
    !action.tile ||
    afterTiles.length <= currentTiles.length
  ) {
    return afterTiles;
  }

  return removeFirstTile(afterTiles, action.tile);
}
