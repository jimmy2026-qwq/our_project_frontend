import type { ClubRelationView } from '@/objects/club';

export type ClubSummaryRelationKind = 'Alliance' | 'Hostile';

export type ClubSummaryRelation =
  | ClubSummaryRelationKind
  | {
      targetClubId: string;
      relation: ClubSummaryRelationKind;
    };

export interface ClubSummary {
  id: string;
  name: string;
  memberCount: number;
  activeMemberCount?: number;
  adminCount?: number;
  powerRating: number;
  treasury: number;
  totalPoints?: number;
  pointPool?: number;
  allianceCount?: number;
  rivalryCount?: number;
  strongestRivalClubId?: string | null;
  strongestRivalPower?: number | null;
  honorTitles?: string[];
  relations: ClubSummaryRelation[];
}

export function toClubSummaryRelation(
  relation: ClubRelationView,
): ClubSummaryRelation {
  return {
    targetClubId: relation.targetClubId,
    relation: relation.relation === 'Alliance' ? 'Alliance' : 'Hostile',
  };
}
