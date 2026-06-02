import type { ClubRelationKind } from './ClubRelationKind';

export interface ClubRelationView {
  targetClubId: string;
  relation: ClubRelationKind;
}
