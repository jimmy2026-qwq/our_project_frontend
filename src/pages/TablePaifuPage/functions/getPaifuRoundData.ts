import type { PaifuAction, PaifuRound as PaifuRoundSummary } from '@/objects';

export function getPaifuRoundActions(round: PaifuRoundSummary): PaifuAction[] {
  return round.timeline.events;
}

export function getPaifuInitialHands(round: PaifuRoundSummary) {
  return Object.fromEntries(
    round.players.map((player) => [
      player.playerId,
      [...player.initialHand.tiles],
    ]),
  );
}
