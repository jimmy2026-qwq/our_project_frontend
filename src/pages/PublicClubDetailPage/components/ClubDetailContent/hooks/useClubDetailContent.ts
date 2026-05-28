import { useMemo, useState } from 'react';

import type { ClubDetailWorkbenchState } from '../../../objects/ClubDetail.types';

export type ClubDetailTab =
  | 'home'
  | 'tournaments'
  | 'applications'
  | 'members'
  | 'contributionChanges';

export function useClubDetailContent(workbench: ClubDetailWorkbenchState) {
  const [activeTab, setActiveTab] = useState<ClubDetailTab>('home');
  const tabItems = useMemo<Array<{ id: ClubDetailTab; label: string }>>(
    () => [
      { id: 'home', label: '俱乐部主页' },
      { id: 'tournaments', label: '相关赛事' },
      ...(workbench.canReviewApplications
        ? [{ id: 'applications' as const, label: '申请处理' }]
        : []),
      { id: 'members', label: '成员列表' },
      ...(workbench.canViewContributionChanges
        ? [{ id: 'contributionChanges' as const, label: '贡献变化' }]
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
