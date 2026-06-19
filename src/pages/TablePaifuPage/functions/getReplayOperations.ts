import {
  HandOutcome,
  PaifuActionType,
  type PaifuAction,
  type PaifuRound as PaifuRoundSummary,
} from '@/objects';
import { getReplayActions } from './getReplayCore';

export function getInitialRoundIndex(rounds: PaifuRoundSummary[]) {
  const firstPlayableIndex = rounds.findIndex(
    (round) => getReplayActions(round).length > 0,
  );

  return firstPlayableIndex >= 0 ? firstPlayableIndex : 0;
}

export function getOperationText(
  action: PaifuAction,
  round: PaifuRoundSummary,
) {
  const note = typeof action.note === 'string' ? action.note : '';

  switch (action.actionType) {
    case PaifuActionType.DrawGame:
      return '\u4e5d\u79cd\u4e5d\u724c';
    case PaifuActionType.Riichi:
      return note.toLowerCase().includes('double riichi') ||
        note.includes('\u4e24\u7acb\u76f4')
        ? '\u4e24\u7acb\u76f4'
        : '\u7acb\u76f4';
    case PaifuActionType.Win:
      return round.result.outcome === HandOutcome.Tsumo
        ? '\u81ea\u6478'
        : '\u8363';
    case PaifuActionType.Chi:
      return '\u5403';
    case PaifuActionType.Pon:
      return '\u78b0';
    case PaifuActionType.Kan:
    case PaifuActionType.AddedKan:
    case PaifuActionType.ClosedKan:
    case PaifuActionType.OpenKan:
      return '\u6760';
    default:
      return undefined;
  }
}

export function isAbortiveDrawAction(action?: PaifuAction) {
  return action?.actionType === PaifuActionType.DrawGame;
}

export function isWinningAction(action?: PaifuAction) {
  return action?.actionType === PaifuActionType.Win;
}

export function isRiichiAction(action?: PaifuAction) {
  return action?.actionType === PaifuActionType.Riichi;
}
