import { Link } from 'react-router-dom';

import type { ClubSummary } from '@/pages/objects/club';
import {
  formatNumber,
  getRelationLabel,
} from '../../objects/labels';

import { hallSectionClassNames } from '../PublicHallSection.styles';

export function ClubRow({ club }: { club: ClubSummary }) {
  return (
    <article
      key={club.id}
      className={hallSectionClassNames.row}
    >
      <div className={hallSectionClassNames.rowMain}>
        <strong>{club.name}</strong>
        <span>{`战力值：${club.powerRating}`}</span>
        <span>{`金库：${formatNumber(club.treasury)}    关系：${club.relations.map(getRelationLabel).join(' / ') || '--'}`}</span>
      </div>
      <div className={hallSectionClassNames.rowSide}>
        <span>{`成员数：${club.memberCount}`}</span>
        <Link
          className={hallSectionClassNames.action}
          to={`/public/clubs/${club.id}`}
        >
          查看详情
        </Link>
      </div>
    </article>
  );
}
