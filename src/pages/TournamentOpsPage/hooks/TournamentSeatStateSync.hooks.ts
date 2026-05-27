import { useEffect, type Dispatch, type SetStateAction } from 'react';

import type { SeatWind } from '@/objects/tournament';
import type { TableDetail } from '@/pages/objects/tournament';

interface TournamentSeatStateSyncParams {
  tableDetail: TableDetail | null;
  seatWind: SeatWind;
  setSeatWind: Dispatch<SetStateAction<SeatWind>>;
  setSeatReady: Dispatch<SetStateAction<boolean>>;
  setSeatDisconnected: Dispatch<SetStateAction<boolean>>;
}

export function useTournamentSeatStateSync({
  tableDetail,
  seatWind,
  setSeatWind,
  setSeatReady,
  setSeatDisconnected,
}: TournamentSeatStateSyncParams) {
  useEffect(() => {
    const seat =
      tableDetail?.seats.find((item) => item.seat === seatWind) ??
      tableDetail?.seats[0] ??
      null;

    if (!seat) {
      setSeatReady(false);
      setSeatDisconnected(false);
      return;
    }

    if (seat.seat !== seatWind) {
      setSeatWind(seat.seat);
    }

    setSeatReady(seat.ready);
    setSeatDisconnected(seat.disconnected);
  }, [seatWind, setSeatDisconnected, setSeatReady, setSeatWind, tableDetail]);
}
