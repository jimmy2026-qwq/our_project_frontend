import { SeatWinds, type SeatWind } from '@/objects/tournament';

export const demoSeats = [
  {
    seat: SeatWinds.East,
    playerId: 'player-east',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: SeatWinds.South,
    playerId: 'player-south',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: SeatWinds.West,
    playerId: 'player-west',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: SeatWinds.North,
    playerId: 'player-north',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
] as const;

export const demoPlayerIdBySeat: Record<SeatWind, string> = {
  [SeatWinds.East]: 'player-east',
  [SeatWinds.South]: 'player-south',
  [SeatWinds.West]: 'player-west',
  [SeatWinds.North]: 'player-north',
};
