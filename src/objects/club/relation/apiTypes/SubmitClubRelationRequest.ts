import type { ClubRelationKind } from '../ClubRelationKind';

export interface SubmitClubRelationRequest {
  operatorId: string;
  targetClubId: string;
  relation: ClubRelationKind;
  note?: string;
}
