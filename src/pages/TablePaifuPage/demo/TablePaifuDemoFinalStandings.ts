import { SeatWind, type FinalStanding as PaifuFinalStanding } from '@/objects';

export const demoFinalStandings: PaifuFinalStanding[] = [
  {
    playerId: 'player-south',
    seat: SeatWind.South,
    finalPoints: 89600,
    placement: 1,
    uma: 20,
    oka: 0,
  },
  {
    playerId: 'player-west',
    seat: SeatWind.West,
    finalPoints: 24000,
    placement: 2,
    uma: 10,
    oka: 0,
  },
  {
    playerId: 'player-north',
    seat: SeatWind.North,
    finalPoints: 24000,
    placement: 3,
    uma: -10,
    oka: 0,
  },
  {
    playerId: 'player-east',
    seat: SeatWind.East,
    finalPoints: -37600,
    placement: 4,
    uma: -20,
    oka: 0,
  },
];
