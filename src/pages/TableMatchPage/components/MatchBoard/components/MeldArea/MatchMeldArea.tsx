import { SeatWinds, type SeatWind } from '@/objects';
import type { MeldGroup } from '@/pages/TablePaifuPage/objects/ReplaySnapshot.types';

import { MeldRow } from './MatchMeldRow';
import { getMeldBoxStyle } from '../../functions/getMatchMeldAreaStyle';
import { matchBoardSeatOrder } from '../../objects/matchBoardSeatOrder';

interface MatchMeldAreaProps {
  melds: Record<SeatWind, MeldGroup[]>;
}

const meldBoxPositionClasses: Record<SeatWind, string> = {
  [SeatWinds.East]: 'bottom-[126px] right-[18%]',
  [SeatWinds.South]: 'right-[126px] top-[20%] rotate-90',
  [SeatWinds.West]: 'left-[18%] top-[150px] rotate-180',
  [SeatWinds.North]: 'left-[126px] bottom-[20%] -rotate-90',
};

export function MatchMeldArea({ melds }: MatchMeldAreaProps) {
  return (
    <>
      {matchBoardSeatOrder.map((seat) => (
        <SeatMeldBox key={seat} melds={melds[seat]} seat={seat} />
      ))}
    </>
  );
}

function SeatMeldBox({
  melds,
  seat,
}: {
  melds: MeldGroup[];
  seat: SeatWind;
}) {
  if (melds.length === 0) {
    return null;
  }

  return (
    <div
      className={[
        'pointer-events-none absolute z-[7] grid content-end gap-1 overflow-visible rounded-[10px] border border-[rgba(236,197,122,0.14)] bg-transparent p-2',
        meldBoxPositionClasses[seat],
      ].join(' ')}
      style={getMeldBoxStyle(melds)}
    >
      {melds.map((meld, meldIndex) => (
        <MeldRow
          key={`${seat}-match-meld-${meld.actionType}-${meldIndex}`}
          meld={meld}
          meldIndex={meldIndex}
          seat={seat}
        />
      ))}
    </div>
  );
}
