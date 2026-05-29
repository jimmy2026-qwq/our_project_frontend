import { useCallback } from 'react';

import { AppealListAPI } from '@/api/tournament';
import type { AppealListQuery } from '@/objects';
import { sendAPI } from '@/system/api';

import { toAppealSummary } from '../objects/PlayerDashboard.mappers';

function getAppeals(filters: AppealListQuery) {
  return sendAPI(new AppealListAPI(filters)).then((envelope) => ({
    ...envelope,
    items: envelope.items.map(toAppealSummary),
  }));
}

export function usePlayerDashboardAppealData() {
  return useCallback(async (operatorId: string) => {
    const appealsEnvelope = await getAppeals({
      openedBy: operatorId,
      limit: 20,
      offset: 0,
    });

    return {
      appeals: [...appealsEnvelope.items].sort((left, right) =>
        (right.updatedAt ?? right.createdAt).localeCompare(
          left.updatedAt ?? left.createdAt,
        ),
      ),
    };
  }, []);
}
