import { SeatWind, type TableSeat } from '@/objects/tournament';

export type TableSeatMap = Record<SeatWind, TableSeat | null>;

export function getTableSeatMap(seats: TableSeat[]): TableSeatMap {
  return {
    [SeatWind.East]:
      seats.find((seat) => seat.seat === SeatWind.East) ?? null,
    [SeatWind.South]:
      seats.find((seat) => seat.seat === SeatWind.South) ?? null,
    [SeatWind.West]:
      seats.find((seat) => seat.seat === SeatWind.West) ?? null,
    [SeatWind.North]:
      seats.find((seat) => seat.seat === SeatWind.North) ?? null,
  };
}
