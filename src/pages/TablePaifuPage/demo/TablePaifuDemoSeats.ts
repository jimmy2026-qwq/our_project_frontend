import type { SeatWind } from '@/objects/tournament';

export const demoSeats = [
  {
    seat: 'East',
    playerId: 'player-east',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: 'South',
    playerId: 'player-south',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: 'West',
    playerId: 'player-west',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
  {
    seat: 'North',
    playerId: 'player-north',
    initialPoints: 25000,
    disconnected: false,
    ready: true,
    clubId: null,
  },
] as const;

export const demoPlayerIdBySeat: Record<SeatWind, string> = {
  East: 'player-east',
  South: 'player-south',
  West: 'player-west',
  North: 'player-north',
};
