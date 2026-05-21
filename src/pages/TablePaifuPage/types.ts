import type { SeatWind } from '@/objects/tournament/apiTypes';

export interface PaifuFinalStanding {
  playerId: string;
  seat: SeatWind;
  finalPoints: number;
  placement: number;
  uma?: number;
  oka?: number;
}

export interface PaifuRoundSummary {
  descriptor: {
    roundWind: SeatWind;
    handNumber: number;
    honba: number;
  };
  actions: Array<{
    sequenceNo: number;
    actor?: string;
    actionType: string;
    tile?: string;
  }>;
  result: {
    outcome: string;
    winner?: string;
    target?: string;
    han?: number;
    fu?: number;
    points: number;
  };
}

export interface TablePaifuDetail {
  id: string;
  metadata: {
    tableId: string;
    tournamentId: string;
    stageId: string;
    recordedAt: string;
  };
  rounds: PaifuRoundSummary[];
  finalStandings: PaifuFinalStanding[];
}
