import { AppealTicketsPanel } from './components/PlayerDashboardContent/components/AppealTicketsPanel';
import { HistoryPaifuPanel } from './components/PlayerDashboardContent/components/HistoryPaifuPanel';
import { PlayerHomePanel } from './components/PlayerDashboardContent/components/PlayerHomePanel';
import { RecentMatchesPanel } from './components/PlayerDashboardContent/components/RecentMatchesPanel';
import { PlayerDashboardFrame } from './components/PlayerDashboardFrame';
import { PlayerDashboardHeader } from './components/PlayerDashboardHeader';
import { PlayerDashboardNavigation } from './components/PlayerDashboardNavigation';
import { PlayerDashboardPanel } from './components/PlayerDashboardPanel';
import { detailShellClassNames } from './components/PlayerDashboardShell.styles';
import { PlayerDashboardEmpty, PlayerDashboardLoading } from './components/PlayerDashboardStatus';
import { PlayerDetailTab } from '@/pages/PlayerDashboardPage/components/PlayerDashboardContent/objects/PlayerDetailTab';
import { usePlayerDashboard } from './hooks/usePlayerDashboard';

/** 加载当前玩家资料并渲染玩家仪表盘的页面。 */
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
            {page.activeTab === PlayerDetailTab.Home ? (
              <PlayerDashboardPanel>
                <PlayerHomePanel
                  player={page.data.player}
                  playerClubs={page.data.playerClubs}
                  dashboard={page.data.dashboard}
                />
              </PlayerDashboardPanel>
            ) : null}

            {page.activeTab === PlayerDetailTab.Recent ? (
              <PlayerDashboardPanel>
                <RecentMatchesPanel items={page.data.recentTables} />
              </PlayerDashboardPanel>
            ) : null}

            {page.activeTab === PlayerDetailTab.History ? (
              <PlayerDashboardPanel>
                <HistoryPaifuPanel items={page.data.archivedRecords} />
              </PlayerDashboardPanel>
            ) : null}

            {page.activeTab === PlayerDetailTab.Appeals ? (
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
