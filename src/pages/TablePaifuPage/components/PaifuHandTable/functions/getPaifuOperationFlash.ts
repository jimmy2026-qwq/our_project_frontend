import { getPaifuInitialHands } from '@/pages/TablePaifuPage/functions/getPaifuRoundData';
import {
  getResultWinForActor,
} from '@/components/mahjong-result/functions/getMahjongResultSequence';

import {
  HandOutcome,
  PaifuActionType,
  type PaifuAction,
  type PaifuRound as PaifuRoundSummary,
} from '@/objects';
import { removeFirstTile } from '../../../functions/getReplayCore';

export const winningCallAnimationMs = 500;
export const winningCallVisibleMs = 1500;
export const riichiCallVisibleMs = 1000;
export const winningCallSettlementWaitMs = 1500;
export const winningCallRevealDelayMs =
  winningCallAnimationMs + winningCallSettlementWaitMs;
export const yakumanTileBurstVisibleMs = 4200;
export const yakumanTileBurstSettleDelayMs = 500;

export function getYakumanBurstTilesForPaifuAction({
  action,
  resultWin,
  round,
}: {
  action: PaifuAction;
  resultWin?: ReturnType<typeof getResultWinForActor>;
  round: PaifuRoundSummary;
}) {
  const tiles =
    action.handTilesAfterAction ??
    (resultWin?.winner ? getPaifuInitialHands(round)[resultWin.winner] : undefined) ??
    [];

  return action.tile ? [action.tile, ...removeFirstTile(tiles, action.tile)] : tiles;
}

export function getWinningCallLabel(round: PaifuRoundSummary) {
  return round.result.outcome === HandOutcome.Tsumo ? '自摸' : '和';
}

export function getOperationFlashDurationMs(action: PaifuAction) {
  return action.actionType === PaifuActionType.Chi ||
    action.actionType === PaifuActionType.Pon
    ? 500
    : 1500;
}
