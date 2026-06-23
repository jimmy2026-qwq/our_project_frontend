import type { TournamentTableSummary } from '@/pages/shared_objects/tournament/TournamentTableSummary';

export interface TableActionPanelProps {
  table: TournamentTableSummary | null;
  operatorId?: string;
  canManageActions: boolean;
  reloadKey: number;
  onRefresh: () => void;
  playerNames: Record<string, string>;
}
