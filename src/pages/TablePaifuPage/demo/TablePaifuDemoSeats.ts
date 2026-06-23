import { SeatWind } from '@/objects/tournament';

export const demoSeats = [
  {
    seat: SeatWind.East,
    playerId: 'player-east',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: SeatWind.South,
    playerId: 'player-south',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: SeatWind.West,
    playerId: 'player-west',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: SeatWind.North,
    playerId: 'player-north',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
] as const;

export const demoPlayerIdBySeat: Record<SeatWind, string> = {
  [SeatWind.East]: 'player-east',
  [SeatWind.South]: 'player-south',
  [SeatWind.West]: 'player-west',
  [SeatWind.North]: 'player-north',
};
