import { HandOutcome, PaifuActionType, type AgariResult, type MahjongPublicEventView, type SeatWind, type MahjongSeatView } from '@/objects';
import { getResultWins, isWinOutcome } from '@/components/mahjong-result/functions/getMahjongResultSequence';
import type { ActiveOperation } from '@/pages/TablePaifuPage/components/PaifuHandTable/objects/ActiveOperation';
import type { WinningCallFlashView } from '@/pages/TablePaifuPage/components/PaifuHandTable/objects/WinningCallFlashView';

import { winningCallAnimationMs } from './matchBoardTiming';

export function createMatchActiveOperation({
  event,
  result,
  seatRotation,
  seats,
}: {
  event: MahjongPublicEventView | null;
  result: AgariResult | null;
  seatRotation: Record<SeatWind, SeatWind>;
  seats: MahjongSeatView[];
}): ActiveOperation | undefined {
  if (!event?.actor) {
    return undefined;
  }

  const seat = seats.find((seatView) => seatView.playerId === event.actor)?.seat;
  const label = getMatchOperationLabel(event, result);

  if (!seat || !label) {
    return undefined;
  }

  return {
    key: event.sequenceNo,
    label,
    seat: seatRotation[seat],
  };
}

export function createMatchWinningCallFlash({
  result,
  resultKey,
  resultWinningCallRemovedKey,
  seatRotation,
  seats,
}: {
  result: AgariResult | null;
  resultKey: string | null;
  resultWinningCallRemovedKey: string | null;
  seatRotation: Record<SeatWind, SeatWind>;
  seats: MahjongSeatView[];
}): WinningCallFlashView | undefined {
  if (
    !result ||
    !resultKey ||
    resultWinningCallRemovedKey === resultKey ||
    !isWinOutcome(result.outcome)
  ) {
    return undefined;
  }

  const winnerId = getResultWins(result)[0]?.winner ?? result.winner;
  const seat = seats.find((seatView) => seatView.playerId === winnerId)?.seat;

  if (!seat) {
    return undefined;
  }

  return {
    animationMs: winningCallAnimationMs,
    key: resultKey,
    label: result.outcome === HandOutcome.Tsumo ? '自摸' : '和',
    seat: seatRotation[seat],
  };
}

export function createMatchRiichiCallFlash({
  event,
  seatRotation,
  seats,
}: {
  event: MahjongPublicEventView | null;
  seatRotation: Record<SeatWind, SeatWind>;
  seats: MahjongSeatView[];
}): WinningCallFlashView | undefined {
  if (event?.actionType !== PaifuActionType.Riichi || !event.actor) {
    return undefined;
  }

  const seat = seats.find((seatView) => seatView.playerId === event.actor)?.seat;

  if (!seat) {
    return undefined;
  }

  return {
    animationMs: winningCallAnimationMs,
    key: event.sequenceNo,
    label: getRiichiCallLabel(event.note),
    seat: seatRotation[seat],
    variant: 'riichi',
  };
}

function getMatchOperationLabel(
  event: MahjongPublicEventView,
  result: AgariResult | null,
) {
  switch (event.actionType) {
    case PaifuActionType.Chi:
      return '吃';
    case PaifuActionType.Pon:
      return '碰';
    case PaifuActionType.Kan:
    case PaifuActionType.OpenKan:
    case PaifuActionType.ClosedKan:
    case PaifuActionType.AddedKan:
      return '杠';
    case PaifuActionType.Riichi:
      return undefined;
    case PaifuActionType.Win:
      return result?.outcome === HandOutcome.Tsumo ? '自摸' : '荣';
    default:
      return undefined;
  }
}

function getRiichiCallLabel(note?: string | null) {
  const normalizedNote = note ?? '';

  return normalizedNote.toLowerCase().includes('double riichi') ||
    normalizedNote.includes('两立直')
    ? '两立直'
    : '立直';
}
