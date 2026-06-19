import { ShowcaseModeToggle } from '@/app/ShowcaseModeToggle';

import { PublicHallActiveView } from './components/PublicHallActiveView';
import {
  PublicHallError,
  PublicHallLoading,
} from './components/PublicHallLoadingState';
import { PublicHallLobbyMenu } from './components/PublicHallLobby/PublicHallLobbyMenu';
import { PublicHallPlayerCard } from './components/PublicHallLobby/PublicHallPlayerCard';
import { lobbyClassNames } from './components/PublicHallLobby/styles';
import { usePublicHallPage } from './hooks/usePublicHallPage';

export function PublicHallHomePage() {
  const page = usePublicHallPage();

  if (page.isLoading && !page.data) {
    return <PublicHallLoading />;
  }

  if (page.error && !page.data) {
    return <PublicHallError message={page.error} />;
  }

  if (!page.data) {
    return <PublicHallError message="当前无法获取公共大厅数据。" />;
  }

  return (
    <section className={lobbyClassNames.portal}>
      <span className={lobbyClassNames.glow} aria-hidden="true" />
      <ShowcaseModeToggle />
      <PublicHallPlayerCard
        displayName={page.displayName}
        eloText={page.eloText}
        showLoginEntry={page.showLoginEntry}
      />

      <div className={lobbyClassNames.lobby}>
        <div className={lobbyClassNames.main}>
          <div className={lobbyClassNames.stage}>
            <div className={lobbyClassNames.stageScroll}>
              <PublicHallActiveView
                canCreateClub={page.canCreateClub}
                canCreateTournament={page.canCreateTournament}
                canManagePlayers={page.canManagePlayers}
                data={page.data}
                isLeaderboardLoading={page.isLeaderboardLoading}
                leaderboardData={page.leaderboardData}
                leaderboardError={page.leaderboardError}
                state={page.state}
                onPlayerManaged={page.onPlayerManaged}
                onRefresh={page.onRefresh}
                onStateChange={page.onStateChange}
              />
            </div>
          </div>
        </div>

        <aside className={lobbyClassNames.sidebar}>
          <PublicHallLobbyMenu
            activeView={page.activeView}
            entries={page.lobbyEntries}
            onActiveViewChange={page.onActiveViewChange}
          />
        </aside>
      </div>
    </section>
  );
}
