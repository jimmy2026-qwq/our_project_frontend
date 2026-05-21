import { Link } from 'react-router-dom';

import { DetailCard, MetricCard, MetricGrid } from '@/components/ui';
import { EmptyState } from '@/components/ui';
import { Button, StatusPill } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { ClubApplicationView } from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';
import type { ClubPublicProfile } from '@/pages/PublicHall/objects';

import {
  formatDateTime,
  formatNumber,
  getRelationLabel,
  getTournamentStatusLabel,
} from '@/pages/PublicHall/objects/utils';
import type { ClubAdminMemberEntry } from '../objects/club-detail.types';

const clubPanelClassNames = {
  list: 'grid h-full min-h-0 grid-rows-[minmax(0,1fr)] gap-[14px]',
  listBody:
    'grid h-full min-h-0 grid-cols-1 auto-rows-auto content-start justify-stretch gap-[14px] overflow-x-hidden overflow-y-scroll [scrollbar-gutter:stable]',
  row:
    'grid items-center gap-[14px] border-2 !border-[rgba(219,175,98,0.38)] bg-[rgba(28,40,74,0.88)] bg-[linear-gradient(180deg,rgba(29,42,78,0.9),rgba(28,40,74,0.88))] px-[18px] py-4 max-[980px]:grid-cols-1 max-[980px]:items-start min-[981px]:grid-cols-[minmax(0,1fr)_auto]',
  rowMain:
    'grid gap-2 [&_span]:text-[rgba(225,230,243,0.92)] [&_strong]:text-[rgba(239,189,111,0.96)]',
  rowSide:
    'grid min-w-[132px] items-center justify-items-end gap-2 text-[rgba(225,230,243,0.92)] max-[980px]:justify-items-start',
  rowSideMemberAdmin: 'min-w-[260px] max-[980px]:min-w-0',
  actionRow:
    'flex flex-nowrap items-center justify-end gap-2.5 max-[980px]:flex-wrap max-[980px]:justify-start',
  action:
    'mt-0 inline-flex min-w-28 cursor-pointer items-center justify-center border !border-[rgba(219,175,98,0.36)] bg-[rgba(56,85,162,0.92)] bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] px-[22px] py-2.5 text-center text-[#f5c98e] no-underline',
  actionSecondary:
    'bg-[linear-gradient(180deg,rgba(111,145,219,0.92),rgba(72,98,176,0.92))]',
  actionDanger:
    'bg-[linear-gradient(180deg,rgba(167,86,86,0.92),rgba(126,52,52,0.92))]',
};

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
            value={
              <span className="text-[#ecc57a]">
                {profile.memberCount}
              </span>
            }
          />
          <MetricCard
            label="战力评分"
            value={
              <span className="text-[#ecc57a]">
                {profile.powerRating}
              </span>
            }
            accent="warning"
          />
          <MetricCard
            label="俱乐部资金"
            value={
              <span className="text-[#ecc57a]">
                {formatNumber(profile.treasury)}
              </span>
            }
          />
          <MetricCard
            label="关系"
            value={
              <span className="text-[#ecc57a]">
                {profile.relations.map(getRelationLabel).join(' / ') || '--'}
              </span>
            }
          />
        </MetricGrid>
        <div className="rounded-[22px] border border-[color:rgba(134,151,176,0.28)] bg-[rgba(255,255,255,0.03)] px-6 py-5">
          <p className="m-0 text-[0.95rem] text-[#c7d6e2]">
            核心成员
          </p>
          <strong className="mt-3 block text-[1.02rem] leading-8 text-[#f2f7fb]">
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
  onOpenLineup: (
    tournament: ClubPublicProfile['activeTournaments'][number],
  ) => void;
}) {
  return (
    <section className={clubPanelClassNames.list}>
      <div className={clubPanelClassNames.listBody}>
        {tournaments.length > 0 ? (
          tournaments.map((item) => (
            <article key={item.id} className={clubPanelClassNames.row}>
              <div className={clubPanelClassNames.rowMain}>
                <strong>{item.name}</strong>
                <span>
                  {item.source === 'invited' ? '受邀赛事' : '相关赛事'}
                </span>
                <span>
                  {item.status ? getTournamentStatusLabel(item.status) : '--'}
                </span>
              </div>
              <div className={clubPanelClassNames.rowSide}>
                {canManageLineup && item.canSubmitLineup ? (
                  <button
                    type="button"
                    className={cx(
                      clubPanelClassNames.action,
                      clubPanelClassNames.actionSecondary,
                    )}
                    onClick={() => onOpenLineup(item)}
                  >
                    邀请成员参赛
                  </button>
                ) : null}
                <Link
                  className={clubPanelClassNames.action}
                  to={`/public/tournaments/${item.id}`}
                  reloadDocument
                >
                  查看详情
                </Link>
              </div>
            </article>
          ))
        ) : (
          <EmptyState asListItem={false}>
            当前还没有可展示的相关赛事。
          </EmptyState>
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
    return (
      <p className="m-0 text-[#9ab0c1]">正在加载申请处理列表...</p>
    );
  }

  return (
    <section className={clubPanelClassNames.list}>
      <div className={clubPanelClassNames.listBody}>
        {applicationInbox.length > 0 ? (
          applicationInbox.map((item) => (
            <article
              key={item.applicationId}
              className={clubPanelClassNames.row}
            >
              <div className={clubPanelClassNames.rowMain}>
                <strong>{item.applicant.displayName}</strong>
                <span>{item.message || '未填写申请说明'}</span>
                <span>
                  {item.applicant.playerId || '--'} /{' '}
                  {formatDateTime(item.submittedAt)}
                </span>
              </div>
              <div className={clubPanelClassNames.rowSide}>
                <StatusPill
                  tone={
                    item.status === 'Pending'
                      ? 'warning'
                      : item.status === 'Approved'
                        ? 'success'
                        : 'danger'
                  }
                >
                  {getApplicationStatusLabel(item.status)}
                </StatusPill>
                {item.canReview && item.status === 'Pending' ? (
                  <>
                    <button
                      type="button"
                      className={clubPanelClassNames.action}
                      onClick={() => onReview(item.applicationId, 'approve')}
                    >
                      通过
                    </button>
                    <button
                      type="button"
                      className={cx(
                        clubPanelClassNames.action,
                        clubPanelClassNames.actionDanger,
                      )}
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
    return (
      <p className="m-0 text-[#9ab0c1]">正在加载成员管理列表...</p>
    );
  }

  return (
    <section className={clubPanelClassNames.list}>
      <div className={clubPanelClassNames.listBody}>
        {members.length > 0 ? (
          members.map((member) => (
            <article
              key={member.playerId}
              className={clubPanelClassNames.row}
            >
              <div className={clubPanelClassNames.rowMain}>
                <div className="flex flex-wrap items-center gap-2">
                  <strong>{member.displayName}</strong>
                  <StatusPill tone={member.isAdmin ? 'success' : 'warning'}>
                    {member.isCurrentUser
                      ? '你'
                      : member.isAdmin
                        ? '管理员'
                        : '成员'}
                  </StatusPill>
                </div>
                {typeof member.elo === 'number' ? (
                  <span>ELO {member.elo}</span>
                ) : null}
                {member.currentRank ? (
                  <span>
                    {member.currentRank.platform} {member.currentRank.tier}
                    {typeof member.currentRank.stars === 'number'
                      ? ` ${member.currentRank.stars}`
                      : ''}
                  </span>
                ) : null}
              </div>
              <div
                className={cx(
                  clubPanelClassNames.rowSide,
                  clubPanelClassNames.rowSideMemberAdmin,
                )}
              >
                {!member.isAdmin ? (
                  <div className={clubPanelClassNames.actionRow}>
                    <button
                      type="button"
                      className={clubPanelClassNames.action}
                      onClick={() => onAssignAdmin(member)}
                    >
                      设为管理员
                    </button>
                    {!member.isCurrentUser ? (
                      <button
                        type="button"
                        className={cx(
                          clubPanelClassNames.action,
                          clubPanelClassNames.actionDanger,
                        )}
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
      {isClubMember ? (
        <StatusPill tone="success">你已经是俱乐部成员</StatusPill>
      ) : null}
      {!isClubMember && currentApplicationStatus === 'Pending' ? (
        <Button
          className="border-[rgba(236,197,122,0.38)] bg-[rgba(236,197,122,0.16)] text-[#ecc57a]"
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
