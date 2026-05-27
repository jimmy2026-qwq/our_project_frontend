import { PlayerDashboardSection } from './components/PlayerDashboardSection';
import {
  PlayerDashboardEmpty,
  PlayerDashboardLoading,
} from './components/PlayerDashboardStatus';
import { usePlayerDashboard } from './hooks';

export function PlayerDashboardPage() {
  const dashboard = usePlayerDashboard();

  if (dashboard.isLoading) {
    return <PlayerDashboardLoading />;
  }

  if (!dashboard.data) {
    return <PlayerDashboardEmpty />;
  }

  return (
    <PlayerDashboardSection
      data={dashboard.data}
      activeTab={dashboard.activeTab}
      onActiveTabChange={dashboard.setActiveTab}
      onLogout={() => void dashboard.handleLogout()}
    />
  );
}
