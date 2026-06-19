import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';

export interface MemberListItem extends PlayerProfile {
  isSelected: boolean;
  isCurrentUser: boolean;
}
