import { useMemo } from 'react';

import { TableStatus } from '@/objects';
import type { TableDetail } from '@/pages/shared_objects/tournament/TableDetail';

import { getTableSeatMap } from '../functions/getTableSeatMap';

export function useTableMatchSeatState(
  table: TableDetail | null,
  operatorId: string,
  isRegisteredPlayer: boolean,
) {
  const seatMap = useMemo(
    () => getTableSeatMap(table?.seats ?? []),
    [table],
  );

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
      table?.status === TableStatus.WaitingPreparation &&
      !ownSeat.disconnected,
    canFileAppeal:
      isRegisteredPlayer &&
      !!operatorId &&
      !!ownSeat &&
      table?.status === TableStatus.Scoring,
  };
}
