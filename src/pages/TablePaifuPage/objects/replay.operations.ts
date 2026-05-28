import type { PaifuAction, PaifuRoundSummary } from '../types';
import { getReplayActions } from './replay.core';

export function getInitialRoundIndex(rounds: PaifuRoundSummary[]) {
  const firstPlayableIndex = rounds.findIndex(
    (round) => getReplayActions(round).length > 0,
  );

  return firstPlayableIndex >= 0 ? firstPlayableIndex : 0;
}

export function getOperationText(action: PaifuAction, round: PaifuRoundSummary) {
  const note = typeof action.note === 'string' ? action.note : '';

  switch (action.actionType) {
    case 'DrawGame':
      return '\u4e5d\u79cd\u4e5d\u724c';
    case 'Riichi':
      return note.toLowerCase().includes('double riichi') ||
        note.includes('\u4e24\u7acb\u76f4')
        ? '\u4e24\u7acb\u76f4'
        : '\u7acb\u76f4';
    case 'Win':
      return round.result.outcome === 'Tsumo' ? '\u81ea\u6478' : '\u8363';
    case 'Chi':
      return '\u5403';
    case 'Pon':
      return '\u78b0';
    case 'Kan':
    case 'AddedKan':
    case 'ClosedKan':
    case 'OpenKan':
      return '\u6760';
    default:
      return undefined;
  }
}

export function isAbortiveDrawAction(action?: PaifuAction) {
  return action?.actionType === 'DrawGame';
}

export function isWinningAction(action?: PaifuAction) {
  return action?.actionType === 'Win';
}
