import type { SeatWind } from '@/objects/tournament';
import type {
  TableDetail,
  TournamentTableSummary,
} from '@/pages/objects/tournament';

export interface TableActionPanelProps {
  table: TournamentTableSummary | null;
  tableDetail: TableDetail | null;
  operatorId?: string;
  canManageActions: boolean;
  isSubmitting: boolean;
  error?: string | null;
  resetNote: string;
  appealDescription: string;
  seatWind: SeatWind;
  seatReady: boolean;
  seatDisconnected: boolean;
  seatNote: string;
  onResetNoteChange: (value: string) => void;
  onAppealDescriptionChange: (value: string) => void;
  onSeatWindChange: (value: SeatWind) => void;
  onSeatReadyChange: (value: boolean) => void;
  onSeatDisconnectedChange: (value: boolean) => void;
  onSeatNoteChange: (value: string) => void;
  onStartTable: () => void;
  onResetTable: () => void;
  onFileAppeal: () => void;
  onUpdateSeatState: () => void;
  onOpenTablePage: () => void;
  onOpenPaifuPage: () => void;
  playerNames: Record<string, string>;
}
