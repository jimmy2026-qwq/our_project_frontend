import { Link } from 'react-router-dom';

import { DetailCard, MetricCard, MetricGrid } from '@/components/shared/data-display';
import { EmptyState } from '@/components/shared/feedback';
import { Button, StatusPill } from '@/components/ui';
import type { PlayerProfile } from '@/domain/auth';
import type { ClubApplicationView } from '@/domain/clubs';
import type { ClubPublicProfile } from '@/domain/public';

import {
  formatDateTime,
  formatNumber,
  getRelationLabel,
  getTournamentStatusLabel,
} from '../utils';
import type { ClubAdminMemberEntry } from './club-detail.types';

function getApplicationStatusLabel(status: ClubApplicationView['status']) {
  switch (status) {
    case 'Pending':
      return '待处理';
    case 'Approved':
      return '已通过';
    case 'Rejected':
      return '已拒绝';
    case 'Withdrawn':
      return '已撤回';
    default:
      return status;
  }
}

export function ClubPublicInfoPanel({
  profile,
  featuredPlayerNames,
}: {
  profile: ClubPublicProfile;
  featuredPlayerNames: string[];
}) {
  return (
    <DetailCard title="俱乐部概览">
      <div className="grid gap-5">
        <MetricGrid>
          <MetricCard
            label="成员数"
            value={<span className="text-[color:var(--gold)]">{profile.memberCount}</span>}
          />
          <MetricCard
            label="战力评分"
            value={<span className="text-[color:var(--gold)]">{profile.powerRating}</span>}
            accent="warning"
          />
          <MetricCard
            label="俱乐部资金"
            value={<span className="text-[color:var(--gold)]">{formatNumber(profile.treasury)}</span>}
          />
          <MetricCard
            label="关系"
            value={
              <span className="text-[color:var(--gold)]">
                {profile.relations.map(getRelationLabel).join(' / ') || '--'}
              </span>
            }
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
                <span>{item.source === 'invited' ? '受邀赛事' : '相关赛事'}</span>
                <span>{item.status ? getTournamentStatusLabel(item.status) : '--'}</span>
              </div>
              <div className="tournament-detail-list__row-side">
                {canManageLineup && item.canSubmitLineup ? (
                  <button
                    type="button"
                    className="tournament-detail-list__action tournament-detail-list__action--secondary"
                    onClick={() => onOpenLineup(item)}
                  >
                    邀请成员参赛
                  </button>
                ) : null}
                <Link
                  className="detail-link tournament-detail-list__action"
                  to={`/public/tournaments/${item.id}`}
                  reloadDocument
                >
                  查看详情
                </Link>
              </div>
            </article>
          ))
        ) : (
          <EmptyState asListItem={false}>当前还没有可展示的相关赛事。</EmptyState>
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
    return <p className="m-0 text-[color:var(--muted)]">正在加载申请处理列表...</p>;
  }

  return (
    <section className="tournament-detail-list">
      <div className="tournament-detail-list__body tournament-detail-list__body--cards">
        {applicationInbox.length > 0 ? (
          applicationInbox.map((item) => (
            <article key={item.applicationId} className="tournament-detail-list__row">
              <div className="tournament-detail-list__row-main">
                <strong>{item.applicant.displayName}</strong>
                <span>{item.message || '未填写申请说明'}</span>
                <span>
                  {item.applicant.playerId || '--'} / {formatDateTime(item.submittedAt)}
                </span>
              </div>
              <div className="tournament-detail-list__row-side">
                <StatusPill
                  tone={item.status === 'Pending' ? 'warning' : item.status === 'Approved' ? 'success' : 'danger'}
                >
                  {getApplicationStatusLabel(item.status)}
                </StatusPill>
                {item.canReview && item.status === 'Pending' ? (
                  <>
                    <button
                      type="button"
                      className="tournament-detail-list__action"
                      onClick={() => onReview(item.applicationId, 'approve')}
                    >
                      通过
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
          <EmptyState asListItem={false}>当前没有待处理的入会申请。</EmptyState>
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
    return <p className="m-0 text-[color:var(--muted)]">正在加载成员管理列表...</p>;
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
                {typeof member.elo === 'number' ? <span>ELO {member.elo}</span> : null}
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
                        移出成员
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <EmptyState asListItem={false}>当前没有可管理的成员数据。</EmptyState>
        )}
      </div>
    </section>
  );
}

export function ClubHeroActions({
  isClubMember,
  canApply,
  currentApplicationStatus,
  onApply,
}: {
  isClubMember: boolean;
  canApply: boolean;
  currentApplicationStatus: ClubApplicationView['status'] | null;
  onApply: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {isClubMember ? <StatusPill tone="success">你已经是俱乐部成员</StatusPill> : null}
      {!isClubMember && currentApplicationStatus === 'Pending' ? (
        <Button
          className="border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.16)] text-[color:var(--gold)]"
          onClick={onApply}
        >
          申请等待处理中
        </Button>
      ) : null}
      {!isClubMember && currentApplicationStatus === 'Rejected' ? (
        <Button
          variant="danger"
          className="border-[rgba(255,123,123,0.34)] bg-[rgba(120,23,23,0.28)] text-[rgba(255,219,219,0.96)]"
          onClick={onApply}
        >
          申请被拒绝
        </Button>
      ) : null}
      {!isClubMember && canApply && !currentApplicationStatus ? (
        <Button variant="secondary" onClick={onApply}>
          申请加入俱乐部
        </Button>
      ) : null}
    </div>
  );
}
