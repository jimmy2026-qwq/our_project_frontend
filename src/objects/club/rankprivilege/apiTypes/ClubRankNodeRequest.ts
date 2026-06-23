import type { ClubPrivilegeCode } from '../ClubPrivilegeCode';

export interface ClubRankNodeRequest {
  code: string;
  label: string;
  minimumContribution: number;
  privileges?: ClubPrivilegeCode[];
}
