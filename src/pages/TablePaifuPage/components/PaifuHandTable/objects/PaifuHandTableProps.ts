import type { PaifuRound as PaifuRoundSummary } from '@/objects';
import type { TablePaifuDetail } from '../../../objects/TablePaifuDetail';

export interface PaifuHandTableProps {
  onSelectRound: (index: number) => void;
  paifu: TablePaifuDetail | null;
  round?: PaifuRoundSummary;
  rounds: PaifuRoundSummary[];
  selectedRoundIndex: number;
  viewerPlayerId: string;
}
