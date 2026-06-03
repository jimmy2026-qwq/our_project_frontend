import type {
  HandOutcome,
  MahjongYakuKind,
  PaifuActionType,
  SeatWind,
  TableSeat,
} from '@/objects/tournament';

export interface PaifuYaku {
  kind: MahjongYakuKind;
  han: number;
}

export interface PaifuScoreChange {
  playerId: string;
  delta: number;
}

export interface PaifuRoundSettlement {
  riichiSticksDelta: number;
  honbaPayment: number;
  notes: string[];
}

export interface PaifuAction {
  sequenceNo: number;
  actor?: string;
  actionType: PaifuActionType | string;
  tile?: string;
  fromPlayer?: string;
  targetSequenceNo?: number;
  shantenAfterAction?: number;
  handTilesAfterAction?: string[];
  revealedTiles: string[];
  note?: string;
}

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
    /**
     * Number of honba sticks at the start of this round. This is a paifu input,
     * not a frontend-derived value; the game engine must apply continuation rules.
     */
    honba: number;
  };
  initialHands: Record<string, string[]>;
  actions: PaifuAction[];
  result: {
    outcome: HandOutcome | string;
    winner?: string;
    target?: string;
    han?: number;
    fu?: number;
    yaku: PaifuYaku[];
    /**
     * Full five dora indicators for this hand. Real paifu records should
     * provide the complete list; doraIndicatorCount controls how many are shown.
     */
    doraIndicators?: string[];
    /**
     * Full five ura-dora indicators for this hand. The displayed count matches
     * doraIndicatorCount, but visibility depends on uraDoraVisible.
     */
    uraDoraIndicators?: string[];
    /**
     * Whether ura-dora should be shown to the viewer. Usually true only when the
     * winning player has riichi; false means the frontend shows five backs.
     */
    uraDoraVisible?: boolean;
    /**
     * Fixed hand value shown in the win result panel. This is not the same as
     * player score delta and should exclude riichi-stick transfer and other
     * settlement bookkeeping. Yakuman examples: pure nine gates is 64000 for a
     * child win and 96000 for a dealer win.
     */
    points: number;
    scoreChanges: PaifuScoreChange[];
    settlement?: PaifuRoundSettlement;
    /**
     * Required for ExhaustiveDraw results. Score changes cannot infer tenpai
     * when all players are tenpai or all players are noten.
     */
    tenpaiPlayerIds?: string[];
  };
}

export interface TablePaifuDetail {
  id: string;
  metadata: {
    tableId: string;
    tournamentId: string;
    stageId: string;
    tournamentName?: string;
    stageName?: string;
    recordedAt: string;
    source?: string;
    seats?: TableSeat[];
    matchRecordId?: string | null;
    playerNames?: Record<string, string>;
  };
  rounds: PaifuRoundSummary[];
  finalStandings: PaifuFinalStanding[];
}
