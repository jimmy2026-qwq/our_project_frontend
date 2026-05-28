import type { PaifuRoundSummary, TablePaifuDetail } from '../../../../types';
import {
  getRoundPlayerId,
  isPlayerTenpai,
  seatOrder,
} from '../../../../objects/replay';
import { operationPositionClasses } from '../../objects/paifuTableLayout';

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
