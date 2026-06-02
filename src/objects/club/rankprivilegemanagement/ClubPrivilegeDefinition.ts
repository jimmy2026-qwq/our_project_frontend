import type { ClubPrivilegeCode } from './ClubPrivilegeCode';

export interface ClubPrivilegeDefinition {
  code: ClubPrivilegeCode;
  label: string;
  description: string;
  delegatedPermissions: string[];
}
