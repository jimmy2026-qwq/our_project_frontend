import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';
import { useAsyncResource } from '@/hooks/useAsyncResource';

import { loadPlayerDashboardData } from '../functions/loadPlayerDashboardData';
import type { PlayerDetailTab } from '../components/PlayerDashboardContent/objects/PlayerDashboardContent.types';

export function usePlayerDashboard() {
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

  return {
    activeTab,
    data,
    isLoading,
    handleLogout,
    setActiveTab,
  };
}
