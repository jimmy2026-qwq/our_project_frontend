import type { TournamentTableSummary } from '@/pages/objects/TournamentViews';

export function getActiveTableRank(status: TournamentTableSummary['status']) {
  switch (status) {
    case 'InProgress':
      return 0;
    case 'Scoring':
      return 1;
    case 'AppealInProgress':
      return 2;
    default:
      return 3;
  }
}
