import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';

import type { PlayerDetailTab } from '../components/PlayerDashboardContent/objects/PlayerDashboardContent.types';
import { usePlayerDashboardData } from './usePlayerDashboardData';

export function usePlayerDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, logout } = useAuth();
  const operatorId = session?.user.operatorId ?? '';
  const [activeTab, setActiveTab] = useState<PlayerDetailTab>(() =>
    resolveInitialTab(searchParams.get('tab')),
  );
  const { data, isLoading } = usePlayerDashboardData(operatorId);

  useEffect(() => {
    const tab = resolveQueryTab(searchParams.get('tab'));
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  async function handleLogout() {
    await logout();
    navigate('/public');
  }

  return {
    activeTab,
    data,
    isLoading,
    handleLogout,
    setActiveTab,
  };
}

function resolveInitialTab(value: string | null): PlayerDetailTab {
  return resolveQueryTab(value) ?? 'home';
}

function resolveQueryTab(value: string | null): PlayerDetailTab | null {
  switch (value) {
    case 'recent':
    case 'history':
    case 'appeals':
      return value;
    default:
      return null;
  }
}
