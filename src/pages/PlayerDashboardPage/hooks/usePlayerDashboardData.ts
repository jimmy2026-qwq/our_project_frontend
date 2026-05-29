import { useAsyncResource } from '@/hooks/useAsyncResource';

import { usePlayerDashboardAppealData } from './usePlayerDashboardAppealData';
import { usePlayerDashboardMatchData } from './usePlayerDashboardMatchData';
import { usePlayerDashboardProfileData } from './usePlayerDashboardProfileData';

export function usePlayerDashboardData(operatorId: string) {
  const loadProfileData = usePlayerDashboardProfileData();
  const loadMatchData = usePlayerDashboardMatchData();
  const loadAppealData = usePlayerDashboardAppealData();

  return useAsyncResource(async () => {
    if (!operatorId) {
      return null;
    }

    try {
      const [profileData, matchData, appealData] = await Promise.all([
        loadProfileData(operatorId),
        loadMatchData(operatorId),
        loadAppealData(operatorId),
      ]);

      return {
        ...profileData,
        ...matchData,
        ...appealData,
      };
    } catch {
      return null;
    }
  }, [loadAppealData, loadMatchData, loadProfileData, operatorId]);
}
