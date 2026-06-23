import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { LogoutAuthAPI, RevokeGuestSessionAuthAPI } from '@/api/auth';
import { readGuestSessionId } from '@/app/auth/functions/authSessionStorage';
import { useAuthContext } from '@/app/auth/useAuthContext';
import { sendAPI } from '@/system/api';

import { PlayerDetailTab } from '@/pages/PlayerDashboardPage/components/PlayerDashboardContent/objects/PlayerDetailTab';
import { usePlayerDashboardData } from './usePlayerDashboardData';

export function usePlayerDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, clearSession } = useAuthContext();
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
    if (session) {
      const guestSessionId = readGuestSessionId(session.token);

      if (guestSessionId) {
        await sendAPI(
          new RevokeGuestSessionAuthAPI(guestSessionId, 'guest-exit'),
        );
      } else {
        await sendAPI(new LogoutAuthAPI(session.token));
      }
    }

    clearSession();
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
  return resolveQueryTab(value) ?? PlayerDetailTab.Home;
}

function resolveQueryTab(value: string | null): PlayerDetailTab | null {
  switch (value) {
    case PlayerDetailTab.Recent:
    case PlayerDetailTab.History:
    case PlayerDetailTab.Appeals:
      return value;
    default:
      return null;
  }
}
