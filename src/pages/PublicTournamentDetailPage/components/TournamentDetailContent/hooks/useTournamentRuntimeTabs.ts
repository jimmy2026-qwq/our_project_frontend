import { useEffect, useMemo, useState } from 'react';

import { TableStatus } from '@/objects';

import type { TournamentDetailWorkbenchState } from '@/pages/PublicTournamentDetailPage/objects/state/workbench/TournamentDetailWorkbenchState';
import { TournamentDetailTab } from '@/pages/PublicTournamentDetailPage/objects/navigation/TournamentDetailTab';

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
      setActiveTab(TournamentDetailTab.Home);
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
        (table) => table.status === TableStatus.WaitingPreparation,
      ),
    [workbench?.visibleTables],
  );
  const canManageAppeals = !!workbench?.canManageTournament && !!operatorId;
  const tabItems: Array<{ id: TournamentDetailTab; label: string }> = [
    { id: TournamentDetailTab.Home, label: '赛事概览' },
    { id: TournamentDetailTab.Rules, label: '规则说明' },
    { id: TournamentDetailTab.Participants, label: '参赛名单' },
    { id: TournamentDetailTab.Tables, label: '赛事牌桌' },
    ...(workbench?.canManageTournament
      ? [
          { id: TournamentDetailTab.Manage, label: '牌桌管理' },
          { id: TournamentDetailTab.Appeals, label: '查看申诉' },
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
    return TournamentDetailTab.Home;
  }

  const tab = new URLSearchParams(window.location.search).get('tab');
  return resolveTab(tab) ?? TournamentDetailTab.Home;
}

function resolveTab(value: string | null): TournamentDetailTab | null {
  switch (value) {
    case TournamentDetailTab.Home:
    case TournamentDetailTab.Rules:
    case TournamentDetailTab.Participants:
    case TournamentDetailTab.Tables:
    case TournamentDetailTab.Manage:
    case TournamentDetailTab.Appeals:
      return value;
    default:
      return null;
  }
}

function isAdminOnlyTab(tab: TournamentDetailTab): boolean {
  return (
    tab === TournamentDetailTab.Manage ||
    tab === TournamentDetailTab.Appeals
  );
}

function persistTabInUrl(tab: TournamentDetailTab): void {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);

  if (tab === TournamentDetailTab.Home) {
    url.searchParams.delete('tab');
  } else {
    url.searchParams.set('tab', tab);
  }

  window.history.replaceState(window.history.state, '', url);
}
