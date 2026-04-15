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
import type { PlayerProfile } from '@/domain/auth';
import type { ClubPublicProfile } from '@/domain/public';

import type { ClubAdminMemberEntry } from './club-detail.types';

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
                  <span>{item.source === 'invited' ? 'Invited tournament' : 'Club-managed tournament'}</span>
                  <Link className="detail-link inline-flex" to={`/public/tournaments/${item.id}`}>
                    Open tournament detail
                  </Link>
                  {canManageLineup && item.source === 'invited' && item.status !== 'Finished' ? (
                    <button
                      type="button"
                      className="detail-link inline-flex cursor-pointer border-0 bg-transparent p-0"
                      onClick={() => onOpenLineup(item)}
                    >
                      Submit lineup
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
    <DetailCard title="Application inbox">
      {isInboxLoading ? (
        <p className="m-0 text-[color:var(--muted)]">Loading pending club applications...</p>
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
                  <ActionButton onClick={() => onReview(item.applicationId, 'approve')}>Approve</ActionButton>
                  <ActionButton onClick={() => onReview(item.applicationId, 'reject')}>Reject</ActionButton>
                </>
              ) : null,
          }))}
          emptyText="No pending applications are waiting for review."
        />
      )}
    </DetailCard>
  );
}

export function ClubAdminMembersPanel({
  isLoading,
  members,
  onAssignAdmin,
  onRemoveMember,
}: {
  isLoading: boolean;
  members: ClubAdminMemberEntry[];
  onAssignAdmin: (member: PlayerProfile) => void;
  onRemoveMember: (member: ClubAdminMemberEntry) => void;
}) {
  return (
    <DetailCard title="Club admin tools">
      {isLoading ? (
        <p className="m-0 text-[color:var(--muted)]">Loading club members...</p>
      ) : members.length > 0 ? (
        <DetailRows>
          {members.map((member) => (
            <DetailRow
              key={member.playerId}
              title={member.displayName}
              detail={
                <span className="inline-flex flex-wrap items-center gap-3">
                  <StatusPill tone={member.isAdmin ? 'success' : 'warning'}>
                    {member.isCurrentUser ? 'You' : member.isAdmin ? 'Admin' : 'Member'}
                  </StatusPill>
                  {member.elo ? <span>Elo {member.elo}</span> : null}
                  {member.currentRank ? (
                    <span>
                      {member.currentRank.platform} {member.currentRank.tier}
                      {typeof member.currentRank.stars === 'number' ? ` ${member.currentRank.stars}` : ''}
                    </span>
                  ) : null}
                  {!member.isAdmin ? (
                    <button
                      type="button"
                      className="detail-link inline-flex cursor-pointer border-0 bg-transparent p-0"
                      onClick={() => onAssignAdmin(member)}
                    >
                      Set as admin
                    </button>
                  ) : null}
                  {!member.isAdmin && !member.isCurrentUser ? (
                    <button
                      type="button"
                      className="detail-link inline-flex cursor-pointer border-0 bg-transparent p-0 text-[color:#ff8f8f]"
                      onClick={() => onRemoveMember(member)}
                    >
                      Remove member
                    </button>
                  ) : null}
                </span>
              }
            />
          ))}
        </DetailRows>
      ) : (
        <EmptyState asListItem>No club members were returned for admin management.</EmptyState>
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
      {isClubMember ? <StatusPill tone="success">You are already connected to this club.</StatusPill> : null}
      {!isClubMember && canApply ? (
        <Button variant="secondary" onClick={onApply}>
          Apply to join this club
        </Button>
      ) : null}
    </div>
  );
}
