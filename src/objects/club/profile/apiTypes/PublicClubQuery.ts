import type { ClubRelationKind } from '@/objects/club';

export interface PublicClubQuery {
  name?: string;
  relation?: ClubRelationKind;
  limit?: number;
  offset?: number;
}
