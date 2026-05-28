import { AppealTicketsPanel } from './components/PlayerDashboardContent/components/AppealTicketsPanel';
import { HistoryPaifuPanel } from './components/PlayerDashboardContent/components/HistoryPaifuPanel';
import { PlayerHomePanel } from './components/PlayerDashboardContent/components/PlayerHomePanel';
import { RecentMatchesPanel } from './components/PlayerDashboardContent/components/RecentMatchesPanel';
import { PlayerDashboardFrame } from './components/PlayerDashboardFrame';
import { PlayerDashboardHeader } from './components/PlayerDashboardHeader';
import { PlayerDashboardNavigation } from './components/PlayerDashboardNavigation';
import { PlayerDashboardPanel } from './components/PlayerDashboardPanel';
import { detailShellClassNames } from './components/PlayerDashboardShell.styles';
import {
  PlayerDashboardEmpty,
  PlayerDashboardLoading,
} from './components/PlayerDashboardStatus';
import { usePlayerDashboard } from './hooks/usePlayerDashboard';

export function PlayerDashboardPage() {
  const page = usePlayerDashboard();

  if (page.isLoading) {
    return <PlayerDashboardLoading />;
  }

  if (!page.data) {
    return <PlayerDashboardEmpty />;
  }

  return (
    <PlayerDashboardFrame>
      <section className={detailShellClassNames.shell}>
        <PlayerDashboardHeader
          playerName={page.data.player.displayName}
          onLogout={() => void page.handleLogout()}
        />

        <div className={detailShellClassNames.frame}>
          <PlayerDashboardNavigation
            activeTab={page.activeTab}
            onActiveTabChange={page.setActiveTab}
          />

          <div className={detailShellClassNames.content}>
            {page.activeTab === 'home' ? (
              <PlayerDashboardPanel>
                <PlayerHomePanel
                  player={page.data.player}
                  playerClubs={page.data.playerClubs}
                  dashboard={page.data.dashboard}
                />
              </PlayerDashboardPanel>
            ) : null}

            {page.activeTab === 'recent' ? (
              <PlayerDashboardPanel>
                <RecentMatchesPanel items={page.data.recentTables} />
              </PlayerDashboardPanel>
            ) : null}

            {page.activeTab === 'history' ? (
              <PlayerDashboardPanel>
                <HistoryPaifuPanel items={page.data.archivedRecords} />
              </PlayerDashboardPanel>
            ) : null}

            {page.activeTab === 'appeals' ? (
              <PlayerDashboardPanel>
                <AppealTicketsPanel items={page.data.appeals} />
              </PlayerDashboardPanel>
            ) : null}
          </div>
        </div>
      </section>
    </PlayerDashboardFrame>
  );
}
