import type { ClubPrivilegeCode } from '@/objects/club';

export interface ClubContributionTitleField {
  rankCode: string;
  defaultLabel: string;
  displayLabel: string;
  minimumContribution?: number;
  privileges?: ClubPrivilegeCode[];
}
