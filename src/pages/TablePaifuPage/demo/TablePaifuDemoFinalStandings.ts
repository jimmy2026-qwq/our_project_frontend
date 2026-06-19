import { SeatWinds, type FinalStanding as PaifuFinalStanding } from '@/objects';

export const demoFinalStandings: PaifuFinalStanding[] = [
  {
    playerId: 'player-south',
    seat: SeatWinds.South,
    finalPoints: 89600,
    placement: 1,
    uma: 20,
    oka: 0,
  },
  {
    playerId: 'player-west',
    seat: SeatWinds.West,
    finalPoints: 24000,
    placement: 2,
    uma: 10,
    oka: 0,
  },
  {
    playerId: 'player-north',
    seat: SeatWinds.North,
    finalPoints: 24000,
    placement: 3,
    uma: -10,
    oka: 0,
  },
  {
    playerId: 'player-east',
    seat: SeatWinds.East,
    finalPoints: -37600,
    placement: 4,
    uma: -20,
    oka: 0,
  },
];
