import { useState } from 'react';

import type { MatchRecordSummary } from '@/pages/objects/tournament';

export function useHistoryPaifuPanel() {
  const [summaryRecord, setSummaryRecord] =
    useState<MatchRecordSummary | null>(null);

  return { summaryRecord, setSummaryRecord };
}
