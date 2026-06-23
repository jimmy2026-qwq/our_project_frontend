import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';

import type { MemberHubOperator } from './MemberHubOperator';

export interface MemberHubOperatorDirectory {
  items: MemberHubOperator[];
  clubsById: Record<string, ClubSummary>;
  warning?: string;
}

export const DEFAULT_MEMBER_HUB_DIRECTORY: MemberHubOperatorDirectory = {
  items: [],
  clubsById: {},
};
