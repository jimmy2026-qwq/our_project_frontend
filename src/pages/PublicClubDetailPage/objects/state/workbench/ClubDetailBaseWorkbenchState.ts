import type { ClubPublicProfile } from '@/pages/shared_objects/club/ClubPublicProfile';

export interface ClubDetailBaseWorkbenchState {
  operatorId: string;
  profile: ClubPublicProfile;
}
