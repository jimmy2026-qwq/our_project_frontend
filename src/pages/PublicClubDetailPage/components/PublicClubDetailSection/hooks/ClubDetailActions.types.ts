import { useDialog } from '@/app/dialog/useDialog';
import { useMutationNotice } from '@/app/feedback/useMutationNotice';

import type { ClubDetailWorkbenchState } from '../../../objects/club-detail.types';
import type { ClubPublicProfile } from '../../../objects/types';
import type { ClubDetailData } from './ClubDetailData.hooks';

export interface ClubDetailActionContext {
  confirmDanger: ReturnType<typeof useDialog>['confirmDanger'];
  data: ClubDetailData;
  notifyMutationResult: ReturnType<typeof useMutationNotice>['notifyMutationResult'];
  onRefreshDetail?: () => void;
  profile: ClubPublicProfile | null;
  workbench: ClubDetailWorkbenchState | null;
}
