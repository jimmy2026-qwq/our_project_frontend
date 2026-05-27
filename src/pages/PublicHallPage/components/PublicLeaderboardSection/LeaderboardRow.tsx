import { Link } from 'react-router-dom';

import type { ClubSummary } from '@/pages/objects/club';
import type { PlayerLeaderboardEntry } from '../../objects/types';
import { getLeaderboardStatusLabel } from '../../objects/labels';

import { hallSectionClassNames } from '../PublicHallSection.styles';

export function LeaderboardRow({
  canManagePlayers,
  clubs,
  index,
  item,
  onManagePlayer,
}: {
  canManagePlayers: boolean;
  clubs: ClubSummary[];
  index: number;
  item: PlayerLeaderboardEntry;
  onManagePlayer: (player: PlayerLeaderboardEntry) => void;
}) {
  const linkedClub =
    clubs.find((club) => item.clubIds?.includes(club.id)) ??
    clubs.find((club) => club.name === item.clubName);

  return (
    <article
      key={item.playerId}
      className={hallSectionClassNames.row}
    >
      <div className={hallSectionClassNames.rowMain}>
        <strong>{item.nickname}</strong>
        <span>{`俱乐部：${item.clubName || '--'}`}</span>
        <span>{`状态：${getLeaderboardStatusLabel(item.status)}`}</span>
      </div>
      <div className={hallSectionClassNames.leaderboardSide}>
        <strong>{`ELO ${item.elo}`}</strong>
        <span>{`排名：${item.rank || index + 1}`}</span>
        {canManagePlayers || linkedClub ? (
          <div className={hallSectionClassNames.actionRow}>
            {canManagePlayers ? (
              <button
                type="button"
                className={hallSectionClassNames.action}
                onClick={() => onManagePlayer(item)}
              >
                管理玩家
              </button>
            ) : null}
            {linkedClub ? (
              <Link
                className={hallSectionClassNames.action}
                to={`/public/clubs/${linkedClub.id}`}
              >
                查看俱乐部
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
