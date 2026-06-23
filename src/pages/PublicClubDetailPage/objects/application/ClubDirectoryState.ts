import type { ClubSummary } from '@/pages/shared_objects/club/ClubSummary';

export interface ClubDirectoryState {
  items: ClubSummary[];
  warning?: string;
}
