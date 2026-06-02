import type { ClubPrivilegeCode } from './ClubPrivilegeCode';

export interface ClubRankNode {
  code: string;
  label: string;
  minimumContribution: number;
  privileges: ClubPrivilegeCode[];
}
