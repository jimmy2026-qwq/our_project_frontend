import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/auth/useAuth';

import type { PlayerDetailTab } from '../components/PlayerDashboardContent/objects/PlayerDashboardContent.types';
import { usePlayerDashboardData } from './usePlayerDashboardData';

export function usePlayerDashboard() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const operatorId = session?.user.operatorId ?? '';
  const [activeTab, setActiveTab] = useState<PlayerDetailTab>('home');
  const { data, isLoading } = usePlayerDashboardData(operatorId);

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
