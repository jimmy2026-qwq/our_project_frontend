import type { PaifuRoundSummary, TablePaifuDetail } from '../../../types';

export interface PaifuHandTableProps {
  onSelectRound: (index: number) => void;
  paifu: TablePaifuDetail;
  round: PaifuRoundSummary;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
  viewerPlayerId: string;
}
