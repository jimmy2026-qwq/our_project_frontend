import type { ClubPrivilegeCode } from './ClubPrivilegeCode';

export interface ClubRankNodeView {
  code: string;
  label: string;
  minimumContribution: number;
  privileges: ClubPrivilegeCode[];
}
