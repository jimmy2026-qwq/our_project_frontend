import { useMutationNotice } from '@/app/feedback/useMutationNotice';
import { useConfirmationDialogActions } from '@/components/confirmation-dialog/useConfirmationDialogActions';

import type { ClubDetailWorkbenchState } from '@/pages/PublicClubDetailPage/objects/state/workbench/ClubDetailWorkbenchState';
import type { ClubPublicProfile } from '@/pages/shared_objects/club/ClubPublicProfile';
import type { ClubDetailData } from '../hooks/useClubDetailData';

export interface ClubDetailActionContext {
  confirmDanger: ReturnType<
    typeof useConfirmationDialogActions
  >['confirmDanger'];
  data: ClubDetailData;
  notifyMutationResult: ReturnType<
    typeof useMutationNotice
  >['notifyMutationResult'];
  onRefreshDetail?: () => void;
  profile: ClubPublicProfile | null;
  workbench: ClubDetailWorkbenchState | null;
}
