import { useEffect, useMemo, useState } from 'react';

import type { TournamentDetailWorkbenchState } from '../../../objects/tournament-detail.types';
import type { TournamentDetailTab } from '../../../objects/tournament-detail.view';

export function useTournamentRuntimeTabs({
  operatorId,
  workbench,
}: {
  operatorId: string;
  workbench: TournamentDetailWorkbenchState | null;
}) {
  const [activeTab, setActiveTab] = useState<TournamentDetailTab>('home');

  useEffect(() => {
    if (!workbench?.canManageTournament) {
      setActiveTab('home');
    }
  }, [workbench?.canManageTournament]);

  const waitingTables = useMemo(
    () =>
      (workbench?.visibleTables ?? []).filter(
        (table) => table.status === 'WaitingPreparation',
      ),
    [workbench?.visibleTables],
  );
  const canManageAppeals = !!workbench?.canManageTournament && !!operatorId;
  const tabItems: Array<{ id: TournamentDetailTab; label: string }> = [
    { id: 'home', label: '赛事概览' },
    { id: 'rules', label: '规则说明' },
    { id: 'participants', label: '参赛名单' },
    { id: 'tables', label: '赛事牌桌' },
    ...(workbench?.canManageTournament
      ? [
          { id: 'manage' as const, label: '牌桌管理' },
          { id: 'appeals' as const, label: '查看申诉' },
        ]
      : []),
  ];

  return {
    activeTab,
    canManageAppeals,
    tabItems,
    waitingTables,
    setActiveTab,
  };
}
