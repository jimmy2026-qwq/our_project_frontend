import { SeatWinds, type SeatWind, type TableSeat } from '@/objects/tournament';

export type TableSeatMap = Record<SeatWind, TableSeat | null>;

export function getTableSeatMap(seats: TableSeat[]): TableSeatMap {
  return {
    [SeatWinds.East]:
      seats.find((seat) => seat.seat === SeatWinds.East) ?? null,
    [SeatWinds.South]:
      seats.find((seat) => seat.seat === SeatWinds.South) ?? null,
    [SeatWinds.West]:
      seats.find((seat) => seat.seat === SeatWinds.West) ?? null,
    [SeatWinds.North]:
      seats.find((seat) => seat.seat === SeatWinds.North) ?? null,
  };
}
