import { Link } from 'react-router-dom';

import { Button } from '@/components/ui';
import { cx } from '@/components/ui/cx';

import type { PlayerDashboardData } from '../../objects/data';
import { PlayerDashboardFrame } from '../PlayerDashboardFrame';
import { AppealTicketsPanel } from './components/AppealTicketsPanel';
import { HistoryPaifuPanel } from './components/HistoryPaifuPanel';
import { PlayerHomePanel } from './components/PlayerHomePanel';
import { RecentMatchesPanel } from './components/RecentMatchesPanel';
import {
  type PlayerDetailTab,
  playerDashboardTabs,
} from './objects/PlayerDashboard.labels';
import { detailShellClassNames } from './styles';

export function PlayerDashboardSection({
  data,
  activeTab,
  onActiveTabChange,
  onLogout,
}: {
  data: PlayerDashboardData;
  activeTab: PlayerDetailTab;
  onActiveTabChange: (tab: PlayerDetailTab) => void;
  onLogout: () => void;
}) {
  const {
    player,
    playerClubs,
    dashboard,
    recentTables,
    archivedRecords,
    appeals,
  } = data;

  return (
    <PlayerDashboardFrame>
      <section className={detailShellClassNames.shell}>
        <header className={detailShellClassNames.header}>
          <Link className={detailShellClassNames.back} to="/public">
            返回大厅
          </Link>
          <div className={detailShellClassNames.title}>{`玩家：${player.displayName}`}</div>
          <div className={detailShellClassNames.headerActions}>
            <Button variant="secondary" onClick={onLogout}>
              退出登录
            </Button>
          </div>
        </header>

        <div className={detailShellClassNames.frame}>
          <aside className={detailShellClassNames.sidebar}>
            {playerDashboardTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={cx(
                  detailShellClassNames.navItem,
                  activeTab === tab.id ? detailShellClassNames.navItemActive : '',
                )}
                onClick={() => onActiveTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <div className={detailShellClassNames.content}>
            {activeTab === 'home' ? (
              <div
                className={cx(
                  detailShellClassNames.panel,
                  detailShellClassNames.panelFull,
                )}
              >
                <PlayerHomePanel
                  player={player}
                  playerClubs={playerClubs}
                  dashboard={dashboard}
                />
              </div>
            ) : null}

            {activeTab === 'recent' ? (
              <div
                className={cx(
                  detailShellClassNames.panel,
                  detailShellClassNames.panelFull,
                )}
              >
                <RecentMatchesPanel items={recentTables} />
              </div>
            ) : null}

            {activeTab === 'history' ? (
              <div
                className={cx(
                  detailShellClassNames.panel,
                  detailShellClassNames.panelFull,
                )}
              >
                <HistoryPaifuPanel items={archivedRecords} />
              </div>
            ) : null}

            {activeTab === 'appeals' ? (
              <div
                className={cx(
                  detailShellClassNames.panel,
                  detailShellClassNames.panelFull,
                )}
              >
                <AppealTicketsPanel items={appeals} />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </PlayerDashboardFrame>
  );
}
