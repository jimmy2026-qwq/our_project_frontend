import type { ClubSummaryRelationKind } from './ClubSummaryRelationKind';

export type ClubSummaryRelation =
  | ClubSummaryRelationKind
  | {
      targetClubId: string;
      relation: ClubSummaryRelationKind;
    };
