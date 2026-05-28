import { PublicHallActiveView } from './components/PublicHallActiveView';
import {
  PublicHallError,
  PublicHallLoading,
} from './components/PublicHallLoadingState';
import { PublicHallLobby } from './components/PublicHallLobby';
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
    <PublicHallLobby
      activeView={page.activeView}
      activeViewMarkup={
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
      }
      displayName={page.displayName}
      eloText={page.eloText}
      entries={page.lobbyEntries}
      showLoginEntry={page.showLoginEntry}
      onActiveViewChange={page.onActiveViewChange}
    />
  );
}
