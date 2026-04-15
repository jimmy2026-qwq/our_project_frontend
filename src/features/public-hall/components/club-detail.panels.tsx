import { Link } from 'react-router-dom';

import { DetailCard, MetricCard, MetricGrid } from '@/components/shared/data-display';
import { EmptyState } from '@/components/shared/feedback';
import { Button, StatusPill } from '@/components/ui';
import type { PlayerProfile } from '@/domain/auth';
import type { ClubApplicationView } from '@/domain/clubs';
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
    <DetailCard title="俱乐部资料">
      <div className="grid gap-5">
        <p className="m-0 text-[color:var(--muted-strong)]">
          俱乐部公开资料已同步到当前详情页。
        </p>
        <MetricGrid>
          <MetricCard label="成员数" value={<span className="text-[color:var(--gold)]">{profile.memberCount}</span>} />
          <MetricCard
            label="战力值"
            value={<span className="text-[color:var(--gold)]">{profile.powerRating}</span>}
            accent="warning"
          />
          <MetricCard
            label="金库"
            value={<span className="text-[color:var(--gold)]">{formatNumber(profile.treasury)}</span>}
          />
          <MetricCard
            label="关系"
            value={<span className="text-[color:var(--gold)]">{profile.relations.map(getRelationLabel).join(' / ') || '--'}</span>}
          />
        </MetricGrid>
        <div className="rounded-[22px] border border-[color:rgba(134,151,176,0.28)] bg-[rgba(255,255,255,0.03)] px-6 py-5">
          <p className="m-0 text-[0.95rem] text-[color:var(--muted-strong)]">核心成员</p>
          <strong className="mt-3 block text-[1.02rem] leading-8 text-[color:var(--text)]">
            {featuredPlayerNames.join(' / ') || '--'}
          </strong>
        </div>
      </div>
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
    <section className="tournament-detail-list">
      <div className="tournament-detail-list__body tournament-detail-list__body--cards">
        {tournaments.length > 0 ? (
          tournaments.map((item) => (
            <article key={item.id} className="tournament-detail-list__row">
              <div className="tournament-detail-list__row-main">
                <strong>{item.name}</strong>
                <span>{item.source === 'invited' ? '受邀赛事' : '俱乐部赛事'}</span>
                <span>{item.status ?? '--'}</span>
              </div>
              <div className="tournament-detail-list__row-side">
                <Link className="detail-link tournament-detail-list__action" to={`/public/tournaments/${item.id}`}>
                  查看详情
                </Link>
                {canManageLineup && item.source === 'invited' && item.status !== 'Finished' ? (
                  <button
                    type="button"
                    className="tournament-detail-list__action tournament-detail-list__action--secondary"
                    onClick={() => onOpenLineup(item)}
                  >
                    提交阵容
                  </button>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <EmptyState asListItem={false}>当前没有可显示的相关赛事。</EmptyState>
        )}
      </div>
    </section>
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
  if (isInboxLoading) {
    return <p className="m-0 text-[color:var(--muted)]">正在加载入会申请...</p>;
  }

  return (
    <section className="tournament-detail-list">
      <div className="tournament-detail-list__body tournament-detail-list__body--cards">
        {applicationInbox.length > 0 ? (
          applicationInbox.map((item) => (
            <article key={item.applicationId} className="tournament-detail-list__row">
              <div className="tournament-detail-list__row-main">
                <strong>{item.applicant.displayName}</strong>
                <span>{item.message || '未填写申请说明。'}</span>
                <span>
                  {item.applicant.playerId} · {formatDateTime(item.submittedAt)}
                </span>
              </div>
              <div className="tournament-detail-list__row-side">
                <StatusPill tone={item.status === 'Pending' ? 'warning' : item.status === 'Approved' ? 'success' : 'danger'}>
                  {item.status}
                </StatusPill>
                {item.canReview && item.status === 'Pending' ? (
                  <>
                    <button
                      type="button"
                      className="tournament-detail-list__action"
                      onClick={() => onReview(item.applicationId, 'approve')}
                    >
                      批准
                    </button>
                    <button
                      type="button"
                      className="tournament-detail-list__action tournament-detail-list__action--danger"
                      onClick={() => onReview(item.applicationId, 'reject')}
                    >
                      拒绝
                    </button>
                  </>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <EmptyState asListItem={false}>当前没有待审核的入会申请。</EmptyState>
        )}
      </div>
    </section>
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
  if (isLoading) {
    return <p className="m-0 text-[color:var(--muted)]">正在加载俱乐部成员...</p>;
  }

  return (
    <section className="tournament-detail-list">
      <div className="tournament-detail-list__body tournament-detail-list__body--cards">
        {members.length > 0 ? (
          members.map((member) => (
            <article key={member.playerId} className="tournament-detail-list__row">
              <div className="tournament-detail-list__row-main">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>{member.displayName}</strong>
                  <StatusPill tone={member.isAdmin ? 'success' : 'warning'}>
                    {member.isCurrentUser ? '你' : member.isAdmin ? '管理员' : '成员'}
                  </StatusPill>
                </div>
                {member.elo ? <span>Elo {member.elo}</span> : null}
                {member.currentRank ? (
                  <span>
                    {member.currentRank.platform} {member.currentRank.tier}
                    {typeof member.currentRank.stars === 'number' ? ` ${member.currentRank.stars}` : ''}
                  </span>
                ) : null}
              </div>
              <div className="tournament-detail-list__row-side tournament-detail-list__row-side--member-admin">
                {!member.isAdmin ? (
                  <div className="tournament-detail-list__action-row">
                    <button
                      type="button"
                      className="tournament-detail-list__action"
                      onClick={() => onAssignAdmin(member)}
                    >
                      设为管理员
                    </button>
                    {!member.isCurrentUser ? (
                      <button
                        type="button"
                        className="tournament-detail-list__action tournament-detail-list__action--danger"
                        onClick={() => onRemoveMember(member)}
                      >
                        移除成员
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <EmptyState asListItem={false}>当前没有可管理的俱乐部成员。</EmptyState>
        )}
      </div>
    </section>
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
      {isClubMember ? <StatusPill tone="success">你已加入该俱乐部</StatusPill> : null}
      {!isClubMember && canApply ? (
        <Button variant="secondary" onClick={onApply}>
          申请加入俱乐部
        </Button>
      ) : null}
    </div>
  );
}
