import type { ClubRelationKind } from '../ClubRelationKind';

export interface UpdateClubRelationRequest {
  operatorId: string;
  targetClubId: string;
  relation: ClubRelationKind;
  note?: string;
}
