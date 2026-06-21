import type { SeatWind } from '@/objects/tournament';

import type { PaifuRound as PaifuRoundSummary } from '@/objects';
import type { TablePaifuDetail } from '../../objects/TablePaifuDetail';
import { getRoundPlayerId } from '../../functions/getReplayPlayers';
import { PlayerHand } from './components/PlayerAreas/PlayerHand';
import { shouldRevealPaifuHand } from './functions/shouldRevealPaifuHand';
import type { usePaifuHandTableReplay } from './hooks/usePaifuHandTableReplay';
import type { HandVisibilityMode } from './objects/HandVisibilityMode';

/** 将单个座位的手牌、副露和河牌组合成牌谱玩家区域。 */
export function PaifuPlayerHand({
  displayPaifu,
  handVisibilityMode,
  replay,
  round,
  seat,
  selfPlayerId,
}: {
  displayPaifu: TablePaifuDetail;
  handVisibilityMode: HandVisibilityMode;
  replay: ReturnType<typeof usePaifuHandTableReplay>;
  round: PaifuRoundSummary;
  seat: SeatWind;
  selfPlayerId: string;
}) {
  const playerId = getRoundPlayerId(displayPaifu, seat);

  return (
    <PlayerHand
      drawnTileIndex={replay.replaySnapshot.drawnTileIndexes[playerId]}
      hands={replay.replaySnapshot.hands}
      paifu={displayPaifu}
      seat={seat}
      shouldRevealHand={shouldRevealPaifuHand({
        handVisibilityMode,
        isExhaustiveDrawResult: replay.isExhaustiveDrawResult,
        playerId,
        revealedWinningPlayerId: replay.revealedWinningPlayerId,
        round,
        selfPlayerId,
      })}
    />
  );
}
