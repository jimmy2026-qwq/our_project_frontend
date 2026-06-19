import {
  getResultWinForActor,
} from '@/components/mahjong-result/functions/getMahjongResultSequence';

import type { PaifuAction, PaifuRoundSummary } from '../../../types';
import { removeFirstTile } from '../../../functions/getReplay';

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
    (resultWin?.winner ? round.initialHands[resultWin.winner] : undefined) ??
    [];

  return action.tile ? [action.tile, ...removeFirstTile(tiles, action.tile)] : tiles;
}

export function getWinningCallLabel(round: PaifuRoundSummary) {
  return round.result.outcome === 'Tsumo' ? '自摸' : '和';
}

export function getOperationFlashDurationMs(action: PaifuAction) {
  return action.actionType === 'Chi' || action.actionType === 'Pon'
    ? 500
    : 1500;
}
