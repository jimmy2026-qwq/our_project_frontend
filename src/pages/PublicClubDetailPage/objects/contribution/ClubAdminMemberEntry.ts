import type { ClubPrivilegeCode } from '@/objects/club';
import type { PlayerProfile } from '@/pages/shared_objects/player/PlayerProfile';

export interface ClubAdminMemberEntry extends PlayerProfile {
  isAdmin: boolean;
  isCurrentUser: boolean;
  contribution?: number;
  rankCode?: string;
  rankLabel?: string;
  privileges?: ClubPrivilegeCode[];
  internalTitle?: string | null;
}
