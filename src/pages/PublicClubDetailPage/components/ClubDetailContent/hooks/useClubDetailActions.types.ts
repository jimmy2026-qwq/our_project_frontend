import { useConfirmationDialogActions } from '@/components/confirmation-dialog/useConfirmationDialogActions';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';

import type { ClubDetailWorkbenchState } from '../../../objects/ClubDetail.types';
import type { ClubPublicProfile } from '../../../objects/PublicClubDetailPage.types';
import type { ClubDetailData } from './useClubDetailData';

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
