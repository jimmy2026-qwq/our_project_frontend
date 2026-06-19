import type { ClubRelationView } from '@/objects/club';

import type { ClubSummaryRelation } from '../objects/ClubSummaryRelation';

// Shared mapper for page-level club summary views used by public pages.
export function toClubSummaryRelation(
  relation: ClubRelationView,
): ClubSummaryRelation {
  return {
    targetClubId: relation.targetClubId,
    relation: relation.relation === 'Alliance' ? 'Alliance' : 'Hostile',
  };
}
