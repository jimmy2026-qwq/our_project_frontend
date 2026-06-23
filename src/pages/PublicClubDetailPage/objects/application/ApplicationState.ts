import type { ClubApplication } from '@/pages/shared_objects/club/ClubApplication';

export interface ApplicationState {
  application: ClubApplication | null;
  warning?: string;
}
