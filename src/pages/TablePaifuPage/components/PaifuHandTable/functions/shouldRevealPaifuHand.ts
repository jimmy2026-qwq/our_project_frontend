import type { PaifuRound as PaifuRoundSummary } from '@/objects';
import { isPlayerTenpai } from '../../../functions/getReplayPlayers';
import { HandVisibilityMode } from '@/pages/TablePaifuPage/components/PaifuHandTable/objects/HandVisibilityMode';

export function shouldRevealPaifuHand({
  handVisibilityMode,
  isExhaustiveDrawResult,
  playerId,
  revealedWinningPlayerId,
  round,
  selfPlayerId,
}: {
  handVisibilityMode: HandVisibilityMode;
  isExhaustiveDrawResult: boolean;
  playerId: string;
  revealedWinningPlayerId?: string;
  round: PaifuRoundSummary;
  selfPlayerId: string;
}) {
  if (!playerId) {
    return false;
  }

  if (handVisibilityMode === HandVisibilityMode.All) {
    return true;
  }

  return (
    playerId === selfPlayerId ||
    playerId === revealedWinningPlayerId ||
    (isExhaustiveDrawResult && isPlayerTenpai(round, playerId))
  );
}
