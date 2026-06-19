import type { SeatWind } from '@/objects/tournament';

import type { PaifuRoundSummary, TablePaifuDetail } from '../types';
import { isExhaustiveDrawRound } from './getReplayCore';

export function getPlayerSeat(paifu: TablePaifuDetail, playerId: string) {
  return (
    paifu.metadata.seats?.find((item) => item.playerId === playerId)?.seat ??
    paifu.finalStandings.find((item) => item.playerId === playerId)?.seat
  );
}

export function getRoundPlayerId(paifu: TablePaifuDetail, seat: SeatWind) {
  return (
    paifu.metadata.seats?.find((item) => item.seat === seat)?.playerId ??
    paifu.finalStandings.find((item) => item.seat === seat)?.playerId ??
    ''
  );
}

export function getPlayerDisplayName(
  paifu: TablePaifuDetail,
  playerId: string,
) {
  return paifu.metadata.playerNames?.[playerId] ?? playerId;
}

export function isPlayerTenpai(round: PaifuRoundSummary, playerId: string) {
  if (!isExhaustiveDrawRound(round)) {
    return false;
  }

  return round.result.tenpaiPlayerIds?.includes(playerId) ?? false;
}
