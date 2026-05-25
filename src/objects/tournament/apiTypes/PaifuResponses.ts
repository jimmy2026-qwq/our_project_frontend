import type { SeatWind, TableSeat } from './TournamentDomainTypes';

export interface TournamentPaifuFinalStandingView {
  playerId: string;
  seat: SeatWind;
  finalPoints: number;
  placement: number;
  uma: number;
  oka: number;
}

export type TournamentPaifuHandOutcome =
  | 'Tsumo'
  | 'Ron'
  | 'ExhaustiveDraw'
  | 'AbortiveDraw';

export type TournamentPaifuActionType =
  | 'Draw'
  | 'Discard'
  | 'Chi'
  | 'Pon'
  | 'Kan'
  | 'Riichi'
  | 'DoraReveal'
  | 'Win'
  | 'DrawGame'
  | 'AddedKan'
  | 'ClosedKan'
  | 'OpenKan';

export interface TournamentPaifuYakuView {
  name: string;
  han: number;
}

export interface TournamentPaifuScoreChangeView {
  playerId: string;
  delta: number;
}

export interface TournamentPaifuRoundSettlementView {
  riichiSticksDelta: number;
  honbaPayment: number;
  notes: string[];
}

export interface TournamentPaifuActionView {
  sequenceNo: number;
  actor: string | null;
  actionType: TournamentPaifuActionType | string;
  tile: string | null;
  shantenAfterAction: number | null;
  handTilesAfterAction: string[] | null;
  revealedTiles: string[];
  note: string | null;
}

export interface TournamentPaifuRoundView {
  descriptor: {
    roundWind: SeatWind;
    handNumber: number;
    honba: number;
  };
  initialHands: Record<string, string[]>;
  actions: TournamentPaifuActionView[];
  result: {
    outcome: TournamentPaifuHandOutcome | string;
    winner: string | null;
    target: string | null;
    han: number | null;
    fu: number | null;
    yaku: TournamentPaifuYakuView[];
    doraIndicators: string[] | null;
    uraDoraIndicators: string[] | null;
    uraDoraVisible: boolean | null;
    points: number;
    scoreChanges: TournamentPaifuScoreChangeView[];
    settlement: TournamentPaifuRoundSettlementView | null;
    tenpaiPlayerIds: string[] | null;
  };
}

export interface TournamentPaifuMetadataView {
  recordedAt: string;
  source: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  seats: TableSeat[];
  matchRecordId: string | null;
}

export interface TournamentPaifuSummaryView {
  paifuId: string;
  tableId: string;
  tournamentId: string;
  stageId: string;
  recordedAt: string;
  source: string;
  matchRecordId: string | null;
  totalHands: number;
  playerIds: string[];
  finalStandings: TournamentPaifuFinalStandingView[];
  metadata: TournamentPaifuMetadataView;
  rounds: TournamentPaifuRoundView[];
}
