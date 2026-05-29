import type { PlayerProfile } from '@/pages/objects/PlayerProfile';

export interface MemberListItem extends PlayerProfile {
  isSelected: boolean;
  isCurrentUser: boolean;
}
