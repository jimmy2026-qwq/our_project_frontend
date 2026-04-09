import { Link } from 'react-router-dom';

import {
  DetailCard,
  DetailList,
  DetailListItem,
  DetailRow,
  DetailRows,
} from '@/components/shared/data-display';
import { ClubApplicationList } from '@/components/shared/domain';
import { EmptyState } from '@/components/shared/feedback';
import { ActionButton } from '@/components/shared/layout';
import { Button, StatusPill } from '@/components/ui';
import type { ClubApplicationView } from '@/domain/clubs';
import type { ClubPublicProfile } from '@/domain/public';

import { formatDateTime, formatNumber, getRelationLabel } from '../utils';

export function ClubPublicInfoPanel({
  profile,
  featuredPlayerNames,
}: {
  profile: ClubPublicProfile;
  featuredPlayerNames: string[];
}) {
  return (
    <DetailCard title="Public club info">
      <DetailList>
        <DetailListItem label="Members" value={profile.memberCount} />
        <DetailListItem label="Power" value={<StatusPill tone="warning">{profile.powerRating}</StatusPill>} />
        <DetailListItem label="Treasury" value={formatNumber(profile.treasury)} />
        <DetailListItem label="Relations" value={profile.relations.map(getRelationLabel).join(' / ') || '--'} />
        <DetailListItem label="Featured players" value={featuredPlayerNames.join(' / ') || '--'} />
      </DetailList>
    </DetailCard>
  );
}

export function ClubRecentTournamentsPanel({
  tournaments,
  canManageLineup,
  onOpenLineup,
}: {
  tournaments: ClubPublicProfile['activeTournaments'];
  canManageLineup: boolean;
  onOpenLineup: (tournament: ClubPublicProfile['activeTournaments'][number]) => void;
}) {
  return (
    <DetailCard title="Recent tournaments">
      <DetailRows>
        {tournaments.length > 0 ? (
          tournaments.map((item) => (
            <DetailRow
              key={item.id}
              title={item.name}
              detail={
                <span className="inline-flex flex-wrap items-center gap-3">
                  <span>{item.source === 'invited' ? 'å®¸èŒ¶î¦é–­â‚¬ç’‡å³°å¼¬ç’§?' : 'é‰ãƒ¨åšœæ·‡å˜ç®°é–®ã„¥å•å¯®â‚¬ç’§å‹¬æž¡éŽºãƒ¥å½›'}</span>
                  <Link className="detail-link inline-flex" to={`/public/tournaments/${item.id}`}>
                    éŒãƒ§æ¹…ç’§æ¶—ç°¨ç’‡ï¸½å„
                  </Link>
                  {canManageLineup && item.source === 'invited' && item.status !== 'Finished' ? (
                    <button
                      type="button"
                      className="detail-link inline-flex cursor-pointer border-0 bg-transparent p-0"
                      onClick={() => onOpenLineup(item)}
                    >
                      éŽ·å¤‰æ±‰é™å‚ç¦Œ
                    </button>
                  ) : null}
                </span>
              }
            />
          ))
        ) : (
          <EmptyState asListItem>No recent tournament entries were returned.</EmptyState>
        )}
      </DetailRows>
    </DetailCard>
  );
}

export function ClubInboxPanel({
  isInboxLoading,
  applicationInbox,
  onReview,
}: {
  isInboxLoading: boolean;
  applicationInbox: ClubApplicationView[];
  onReview: (applicationId: string, decision: 'approve' | 'reject') => void;
}) {
  return (
    <DetailCard title="æ·‡å˜ç®°é–®ã„¥å§žéãƒ§æ•µç’‡å³°î…¸éŽµ?">
      {isInboxLoading ? (
        <p className="m-0 text-[color:var(--muted)]">å§ï½…æ¹ªé”çŠºæµ‡å¯°å‘­î…¸éŽµåœ­æ•µç’‡?..</p>
      ) : (
        <ClubApplicationList
          items={applicationInbox.map((item) => ({
            id: item.applicationId,
            title: item.applicant.displayName,
            message: item.message,
            submittedAt: formatDateTime(item.submittedAt),
            status: item.status,
            meta: item.applicant.playerId,
            actions:
              item.canReview && item.status === 'Pending' ? (
                <>
                  <ActionButton onClick={() => onReview(item.applicationId, 'approve')}>é–«æ°³ç¹ƒ</ActionButton>
                  <ActionButton onClick={() => onReview(item.applicationId, 'reject')}>éŽ·æŽ”ç²·</ActionButton>
                </>
              ) : null,
          }))}
          emptyText="è¤°æ’³å¢ å¨Œâ„ƒæ¹å¯°å‘­î…¸éŽµåœ­æ®‘é”çŠ²å†é¢å® î‡¬éŠ†?"
        />
      )}
    </DetailCard>
  );
}

export function ClubHeroActions({
  isClubMember,
  canApply,
  onApply,
}: {
  isClubMember: boolean;
  canApply: boolean;
  onApply: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {isClubMember ? <StatusPill tone="success">æµ£çŠ²å‡¡ç¼å¿”æ§¸æ·‡å˜ç®°é–®ã„¦åžšé›?</StatusPill> : null}
      {!isClubMember && canApply ? (
        <Button variant="secondary" onClick={onApply}>
          éŽ´æˆžå…‚é¢å® î‡¬é”çŠ²å†æ©æ¬Žé‡œæ·‡å˜ç®°é–®?
        </Button>
      ) : null}
    </div>
  );
}
