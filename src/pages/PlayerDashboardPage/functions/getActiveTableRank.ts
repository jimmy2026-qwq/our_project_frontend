import { TableStatuses } from '@/objects';
import type { TournamentTableSummary } from '@/pages/shared_objects/tournament/TournamentTableSummary';

export function getActiveTableRank(status: TournamentTableSummary['status']) {
  switch (status) {
    case TableStatuses.InProgress:
      return 0;
    case TableStatuses.Scoring:
      return 1;
    case TableStatuses.AppealInProgress:
      return 2;
    default:
      return 3;
  }
}
