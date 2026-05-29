import { useEffect, type Dispatch, type SetStateAction } from 'react';

import { useRefreshNotice } from '@/app/feedback/useRefreshNotice';
import type {
  AppealSummary,
  MatchRecordSummary,
  TournamentTableSummary,
} from '@/pages/objects/TournamentViews';

import type { LoadState, TournamentDirectoryState } from '../objects/data';

interface TournamentOpsRefreshNoticeParams {
  directory: TournamentDirectoryState | null;
  tables: LoadState<TournamentTableSummary> | null;
  records: LoadState<MatchRecordSummary> | null;
  appeals: LoadState<AppealSummary> | null;
  isLoading: boolean;
  pendingRefresh: boolean;
  setPendingRefresh: Dispatch<SetStateAction<boolean>>;
}

export function useTournamentOpsRefreshNotice({
  directory,
  tables,
  records,
  appeals,
  isLoading,
  pendingRefresh,
  setPendingRefresh,
}: TournamentOpsRefreshNoticeParams) {
  const { notifyRefreshResult } = useRefreshNotice();

  useEffect(() => {
    if (
      !pendingRefresh ||
      isLoading ||
      !directory ||
      !tables ||
      !records ||
      !appeals
    ) {
      return;
    }

    notifyRefreshResult([directory, tables, records, appeals], {
      failureTitle: 'Tournament ops refresh failed',
      successTitle: 'Tournament ops refreshed',
      successMessage: 'Tables, records, and appeals were reloaded.',
      fallbackTitle: 'Tournament ops refreshed with warnings',
      fallbackMessage: 'Some tournament ops panels could not be confirmed.',
    });

    setPendingRefresh(false);
  }, [
    appeals,
    directory,
    isLoading,
    notifyRefreshResult,
    pendingRefresh,
    records,
    setPendingRefresh,
    tables,
  ]);
}
