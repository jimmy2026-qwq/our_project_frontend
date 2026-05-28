import type {
  TournamentTableSummary,
} from '@/pages/objects/tournament';

export interface TableActionPanelProps {
  table: TournamentTableSummary | null;
  operatorId?: string;
  canManageActions: boolean;
  reloadKey: number;
  onRefresh: () => void;
  playerNames: Record<string, string>;
}
