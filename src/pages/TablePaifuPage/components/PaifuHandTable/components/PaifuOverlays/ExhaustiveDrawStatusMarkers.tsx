import type { PaifuRound as PaifuRoundSummary } from '@/objects';
import type { TablePaifuDetail } from '../../../../objects/TablePaifuDetail';
import {
  getRoundPlayerId,
  isPlayerTenpai,
} from '../../../../functions/getReplayPlayers';
import { replaySeatOrder as seatOrder } from '../../../../objects/replaySeatInfo';
import { operationPositionClasses } from '../../objects/paifuTableLayout';

/** 流局时标记各玩家听牌或未听状态。 */
export function ExhaustiveDrawStatusMarkers({
  paifu,
  round,
}: {
  paifu: TablePaifuDetail;
  round: PaifuRoundSummary;
}) {
  return (
    <>
      {seatOrder.map((seat) => {
        const playerId = getRoundPlayerId(paifu, seat);

        if (!playerId) {
          return null;
        }

        return (
          <div
            key={`${seat}-exhaustive-status`}
            className={[
              'pointer-events-none absolute z-[12] text-2xl font-bold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.78)]',
              operationPositionClasses[seat],
            ].join(' ')}
          >
            {isPlayerTenpai(round, playerId) ? '\u542c\u724c' : '\u6ca1\u542c'}
          </div>
        );
      })}
    </>
  );
}
