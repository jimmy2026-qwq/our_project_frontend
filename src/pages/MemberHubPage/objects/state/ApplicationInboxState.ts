import type { ClubApplicationView } from '@/pages/shared_objects/club/ClubApplicationView';

export interface ApplicationInboxState {
  items: ClubApplicationView[];
  warning?: string;
}
