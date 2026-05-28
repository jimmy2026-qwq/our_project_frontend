import { cx } from '@/components/ui/cx';
import type { PublicView } from '../../objects/PublicHallPage.types';

import { lobbyClassNames } from './styles';

export interface PublicHallLobbyEntry {
  id: PublicView;
  label: string;
  heading: string;
  detail: string;
}

interface PublicHallLobbyMenuProps {
  activeView: PublicView;
  entries: PublicHallLobbyEntry[];
  onActiveViewChange: (activeView: PublicView) => void;
}

export function PublicHallLobbyMenu({
  activeView,
  entries,
  onActiveViewChange,
}: PublicHallLobbyMenuProps) {
  return (
    <div className={lobbyClassNames.menu}>
      {entries.map((entry) => (
        <button
          key={entry.id}
          type="button"
          className={cx(
            lobbyClassNames.menuButton,
            activeView === entry.id ? lobbyClassNames.menuButtonActive : '',
          )}
          onClick={() => onActiveViewChange(entry.id)}
        >
          <span className={lobbyClassNames.menuFrame} aria-hidden="true">
            <span className={lobbyClassNames.menuFrameInner} />
          </span>
          <span className={lobbyClassNames.menuSurface} aria-hidden="true">
            <span className={lobbyClassNames.menuSurfacePattern} />
          </span>
          <span
            className={cx(
              lobbyClassNames.menuFlower,
              lobbyClassNames.menuFlowerLeft,
            )}
            aria-hidden="true"
          />
          <span
            className={cx(
              lobbyClassNames.menuFlower,
              lobbyClassNames.menuFlowerRight,
            )}
            aria-hidden="true"
          />
          <span className={lobbyClassNames.menuAlert} aria-hidden="true">
            !
          </span>
          <span className={lobbyClassNames.menuCopy}>
            <span className={lobbyClassNames.menuEyebrow}>
              {entry.label}
            </span>
            <strong className={lobbyClassNames.menuTitle}>
              {entry.heading}
            </strong>
          </span>
          <small className={lobbyClassNames.menuTag}>
            {entry.detail}
          </small>
        </button>
      ))}
    </div>
  );
}
