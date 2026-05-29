import { useMemo } from 'react';

import type { TableDetail } from '@/pages/objects/TournamentViews';

export function useTableMatchSeatState(
  table: TableDetail | null,
  operatorId: string,
  isRegisteredPlayer: boolean,
) {
  const seatMap = useMemo(() => {
    const entries = table?.seats ?? [];
    return {
      East: entries.find((seat) => seat.seat === 'East') ?? null,
      South: entries.find((seat) => seat.seat === 'South') ?? null,
      West: entries.find((seat) => seat.seat === 'West') ?? null,
      North: entries.find((seat) => seat.seat === 'North') ?? null,
    };
  }, [table]);

  const ownSeat = useMemo(
    () => table?.seats.find((seat) => seat.playerId === operatorId) ?? null,
    [operatorId, table],
  );

  return {
    seatMap,
    ownSeat,
    canUpdateOwnReady:
      isRegisteredPlayer &&
      !!operatorId &&
      !!ownSeat &&
      table?.status === 'WaitingPreparation' &&
      !ownSeat.disconnected,
    canFileAppeal:
      isRegisteredPlayer &&
      !!operatorId &&
      !!ownSeat &&
      table?.status !== 'Archived' &&
      table?.status !== 'AppealInProgress',
  };
}
