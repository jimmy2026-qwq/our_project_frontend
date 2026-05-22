import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { useAsyncResource } from '@/hooks/useAsyncResource';

import {
  PlayerDashboardEmpty,
  PlayerDashboardLoading,
  PlayerDashboardShell,
} from './components/player-dashboard';
import { loadPlayerDashboardData } from './objects/data';

type PlayerDetailTab = 'home' | 'recent' | 'history' | 'appeals';

export function PlayerDashboardPage() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const operatorId = session?.user.operatorId ?? '';
  const [activeTab, setActiveTab] = useState<PlayerDetailTab>('home');

  const { data, isLoading } = useAsyncResource(async () => {
    if (!operatorId) {
      return null;
    }

    try {
      return await loadPlayerDashboardData(operatorId);
    } catch {
      return null;
    }
  }, [operatorId]);

  async function handleLogout() {
    await logout();
    navigate('/public');
  }

  if (isLoading) {
    return <PlayerDashboardLoading />;
  }

  if (!data) {
    return <PlayerDashboardEmpty />;
  }

  return (
    <PlayerDashboardShell
      data={data}
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      onLogout={() => void handleLogout()}
    />
  );
}
