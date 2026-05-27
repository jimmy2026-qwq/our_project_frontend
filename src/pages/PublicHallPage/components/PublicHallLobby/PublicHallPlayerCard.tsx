import { Link } from 'react-router-dom';

import { lobbyClassNames } from './styles';

interface PublicHallPlayerCardProps {
  displayName: string;
  eloText: string;
  showLoginEntry: boolean;
}

export function PublicHallPlayerCard({
  displayName,
  eloText,
  showLoginEntry,
}: PublicHallPlayerCardProps) {
  return (
    <section className={lobbyClassNames.playerCard}>
      <span className={lobbyClassNames.playerCardOuter} aria-hidden="true" />
      <span className={lobbyClassNames.playerCardInner} aria-hidden="true" />
      <div className={lobbyClassNames.playerCopy}>
        <p className={lobbyClassNames.playerMeta}>
          <span>{`ELO: ${eloText}`}</span>
        </p>
        <strong className={lobbyClassNames.playerLink}>
          {displayName}
        </strong>
      </div>
      <Link
        to={showLoginEntry ? '/login' : '/me'}
        className={
          showLoginEntry
            ? lobbyClassNames.playerLogin
            : lobbyClassNames.playerAvatar
        }
        aria-label="进入个人主页"
        title="进入个人主页"
      >
        {showLoginEntry ? (
          '登录'
        ) : (
          <span
            className={lobbyClassNames.avatarIcon}
            aria-hidden="true"
          >
            <span className={lobbyClassNames.avatarIconHead} />
            <span className={lobbyClassNames.avatarIconBody} />
          </span>
        )}
      </Link>
    </section>
  );
}
