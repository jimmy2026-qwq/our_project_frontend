import { TableStatus } from '@/objects';
import type { TournamentTableSummary } from '@/pages/shared_objects/tournament/TournamentTableSummary';

export function getActiveTableRank(status: TournamentTableSummary['status']) {
  switch (status) {
    case TableStatus.InProgress:
      return 0;
    case TableStatus.Scoring:
      return 1;
    case TableStatus.AppealInProgress:
      return 2;
    default:
      return 3;
  }
}
