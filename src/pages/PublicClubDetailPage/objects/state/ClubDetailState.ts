import type { ClubPublicProfile } from '@/pages/shared_objects/club/ClubPublicProfile';

export interface ClubDetailState {
  item: ClubPublicProfile | null;
  warning?: string;
}
