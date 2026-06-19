import type {
  MahjongLegalAction,
  MahjongPublicEventView,
  MahjongTableView,
} from '@/objects';
import type { TableDetail } from '@/pages/objects/TournamentViews';

export interface MatchBoardProps {
  actionError: string | null;
  finalSettlementTable: MahjongTableView | null;
  isSubmittingAction: boolean;
  mahjongAcceptedEvent: MahjongPublicEventView | null;
  mahjongTable: MahjongTableView;
  onConfirmFinalSettlement: () => void;
  onAdvanceRound: () => void | Promise<void>;
  onSubmitAction: (action: MahjongLegalAction) => void;
  operatorId: string;
  playerNames: Record<string, string>;
  showcaseMode: boolean;
  table: TableDetail;
}
