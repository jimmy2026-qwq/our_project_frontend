import { useMemo, useState } from 'react';

import type { ClubDetailWorkbenchState } from '@/pages/PublicClubDetailPage/objects/state/workbench/ClubDetailWorkbenchState';
import { ClubDetailTab } from '../objects/ClubDetailTab';

export function useClubDetailContent(workbench: ClubDetailWorkbenchState) {
  const [activeTab, setActiveTab] = useState<ClubDetailTab>(
    ClubDetailTab.Home,
  );
  const tabItems = useMemo<Array<{ id: ClubDetailTab; label: string }>>(
    () => [
      { id: ClubDetailTab.Home, label: '俱乐部主页' },
      { id: ClubDetailTab.Tournaments, label: '相关赛事' },
      ...(workbench.canReviewApplications
        ? [{ id: ClubDetailTab.Applications, label: '申请处理' }]
        : []),
      { id: ClubDetailTab.Members, label: '成员列表' },
      ...(workbench.canViewContributionChanges
        ? [{ id: ClubDetailTab.ContributionChanges, label: '贡献变化' }]
        : []),
    ],
    [workbench.canReviewApplications, workbench.canViewContributionChanges],
  );

  return {
    activeTab,
    setActiveTab,
    tabItems,
  };
}
