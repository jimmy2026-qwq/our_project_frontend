import type { ReactNode } from 'react';
import type { PublicView } from '../../objects/PublicHallPage.types';

import { PublicHallLobbyMenu, type PublicHallLobbyEntry } from './PublicHallLobbyMenu';
import { PublicHallPlayerCard } from './PublicHallPlayerCard';
import { lobbyClassNames } from './styles';

interface PublicHallLobbyProps {
  activeView: PublicView;
  activeViewMarkup: ReactNode;
  displayName: string;
  eloText: string;
  entries: PublicHallLobbyEntry[];
  showLoginEntry: boolean;
  onActiveViewChange: (activeView: PublicView) => void;
}

export function PublicHallLobby({
  activeView,
  activeViewMarkup,
  displayName,
  eloText,
  entries,
  showLoginEntry,
  onActiveViewChange,
}: PublicHallLobbyProps) {
  return (
    <section className={lobbyClassNames.portal}>
      <span className={lobbyClassNames.glow} aria-hidden="true" />
      <PublicHallPlayerCard
        displayName={displayName}
        eloText={eloText}
        showLoginEntry={showLoginEntry}
      />

      <div className={lobbyClassNames.lobby}>
        <div className={lobbyClassNames.main}>
          <div className={lobbyClassNames.stage}>
            <div className={lobbyClassNames.stageScroll}>
              {activeViewMarkup}
            </div>
          </div>
        </div>

        <aside className={lobbyClassNames.sidebar}>
          <PublicHallLobbyMenu
            activeView={activeView}
            entries={entries}
            onActiveViewChange={onActiveViewChange}
          />
        </aside>
      </div>
    </section>
  );
}
