import { useEffect, useMemo, useState } from 'react';

import type { TournamentDetailWorkbenchState } from '../../../objects/TournamentDetail.types';
import type { TournamentDetailTab } from '../../../objects/TournamentDetailView.types';

export function useTournamentRuntimeTabs({
  operatorId,
  workbench,
}: {
  operatorId: string;
  workbench: TournamentDetailWorkbenchState | null;
}) {
  const [activeTab, setActiveTab] = useState<TournamentDetailTab>(() =>
    resolveInitialTab(),
  );

  useEffect(() => {
    if (!workbench) {
      return;
    }

    if (!workbench.canManageTournament && isAdminOnlyTab(activeTab)) {
      setActiveTab('home');
    }
  }, [activeTab, workbench]);

  useEffect(() => {
    persistTabInUrl(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleLocationChange = () => {
      const queryTab = resolveTab(new URLSearchParams(window.location.search).get('tab'));
      if (queryTab) {
        setActiveTab(queryTab);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

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

function resolveInitialTab(): TournamentDetailTab {
  if (typeof window === 'undefined') {
    return 'home';
  }

  const tab = new URLSearchParams(window.location.search).get('tab');
  return resolveTab(tab) ?? 'home';
}

function resolveTab(value: string | null): TournamentDetailTab | null {
  switch (value) {
    case 'home':
    case 'rules':
    case 'participants':
    case 'tables':
    case 'manage':
    case 'appeals':
      return value;
    default:
      return null;
  }
}

function isAdminOnlyTab(tab: TournamentDetailTab): boolean {
  return tab === 'manage' || tab === 'appeals';
}

function persistTabInUrl(tab: TournamentDetailTab): void {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);

  if (tab === 'home') {
    url.searchParams.delete('tab');
  } else {
    url.searchParams.set('tab', tab);
  }

  window.history.replaceState(window.history.state, '', url);
}
