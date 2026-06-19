import type { ClubRelationKind } from '@/objects/club';

export type ClubSummaryRelation =
  | ClubRelationKind
  | {
      targetClubId: string;
      relation: ClubRelationKind;
    };
