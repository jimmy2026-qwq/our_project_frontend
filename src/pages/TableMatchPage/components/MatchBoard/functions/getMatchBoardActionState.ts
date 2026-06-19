import type { MahjongLegalAction } from '@/objects';

import { isCallResponseAction } from './getMatchBoardKeys';

interface GetMatchBoardActionStateParams {
  isTurnActionDelayActive: boolean;
  legalActions: MahjongLegalAction[];
}

export function getMatchBoardActionState({
  isTurnActionDelayActive,
  legalActions,
}: GetMatchBoardActionStateParams) {
  const visibleLegalActions = isTurnActionDelayActive ? [] : legalActions;

  return {
    discardActions: visibleLegalActions.filter(
      (action) => action.commandType === 'Discard',
    ),
    hasCallResponseActions: legalActions.some(isCallResponseAction),
    hasVisibleButtonActions: visibleLegalActions.some(
      (action) => action.commandType !== 'Discard',
    ),
    riichiActions: visibleLegalActions.filter(
      (action) => action.commandType === 'Riichi',
    ),
    visibleLegalActions,
  };
}
