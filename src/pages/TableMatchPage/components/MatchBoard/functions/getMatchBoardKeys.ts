import type { MahjongLegalAction, MahjongTableView } from '@/objects';

export function getTurnActionDelayKey(
  mahjongTable: MahjongTableView,
  operatorId: string,
) {
  const round = mahjongTable.currentRound;

  if (
    !operatorId ||
    !round ||
    round.phase !== 'PlayerTurn' ||
    round.turnPlayerId !== operatorId
  ) {
    return null;
  }

  const actions = mahjongTable.legalActions ?? [];

  if (
    !actions.some((action) => action.commandType === 'Discard') ||
    actions.some(isCallResponseAction)
  ) {
    return null;
  }

  return [
    mahjongTable.tableId,
    round.descriptor.roundWind,
    round.descriptor.handNumber,
    round.descriptor.honba,
    mahjongTable.lastEventSequenceNo,
    operatorId,
  ].join(':');
}

export function getCurrentRoundKey(mahjongTable: MahjongTableView) {
  const round = mahjongTable.currentRound;

  if (!round) {
    return 'no-round';
  }

  return [
    mahjongTable.tableId,
    round.descriptor.roundWind,
    round.descriptor.handNumber,
    round.descriptor.honba,
  ].join(':');
}

export function getResultKey(mahjongTable: MahjongTableView) {
  const round = mahjongTable.currentRound;
  const result = mahjongTable.currentRound?.result;

  if (!round || !result) {
    return null;
  }

  return [
    mahjongTable.tableId,
    round.descriptor.roundWind,
    round.descriptor.handNumber,
    round.descriptor.honba,
    result.outcome,
    result.winner,
    result.target,
    result.points,
    (result.wins ?? [])
      .map((win) => `${win.winner}:${win.target ?? ''}:${win.points}`)
      .join('|'),
  ].join(':');
}

export function isCallResponseAction(action: MahjongLegalAction) {
  return (
    action.commandType === 'Chi' ||
    action.commandType === 'Pon' ||
    action.commandType === 'OpenKan' ||
    action.commandType === 'Ron' ||
    action.commandType === 'Pass'
  );
}
