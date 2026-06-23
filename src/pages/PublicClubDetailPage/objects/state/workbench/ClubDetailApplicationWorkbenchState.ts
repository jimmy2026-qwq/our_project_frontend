import type { ClubApplication } from '@/pages/shared_objects/club/ClubApplication';
import type { ClubApplicationView } from '@/pages/shared_objects/club/ClubApplicationView';

export interface ClubDetailApplicationWorkbenchState {
  applicationInbox: ClubApplicationView[];
  canApply: boolean;
  canReviewApplications: boolean;
  currentApplicationStatus: ClubApplication['status'] | null;
  isApplicationDialogOpen: boolean;
  isInboxLoading: boolean;
}
