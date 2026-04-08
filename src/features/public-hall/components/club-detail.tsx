import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { clubsApi } from '@/api/clubs';
import {
  DetailCard,
  DetailHero,
  DetailList,
  DetailListItem,
  DetailPageShell,
  DetailRow,
  DetailRows,
} from '@/components/shared/data-display';
import { ClubApplicationList } from '@/components/shared/domain';
import { EmptyState } from '@/components/shared/feedback';
import { ActionButton } from '@/components/shared/layout';
import { Button, StatusPill } from '@/components/ui';
import type { ClubApplicationView, ClubPublicProfile } from '@/domain/models';
import { useDialog, useMutationNotice } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import { loadPlayerContext } from '@/features/blueprint/application-data';

import { ClubApplicationDialog } from '../ClubApplicationDialog';
import { ClubTournamentLineupDialog } from '../ClubTournamentLineupDialog';
import type { DetailState } from '../types';
import { formatDateTime, formatNumber, getRelationLabel } from '../utils';
import { PublicDetailNotFound } from './shared';

export const PublicClubDetailSection = ({
  state,
  onRefreshDetail,
}: {
  state: DetailState<ClubPublicProfile>;
  onRefreshDetail?: () => void;
}) => {
  const { session } = useAuth();
  const { confirmDanger } = useDialog();
  const { notifyMutationResult } = useMutationNotice();
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isLineupDialogOpen, setIsLineupDialogOpen] = useState(false);
  const [selectedLineupTournament, setSelectedLineupTournament] = useState<ClubPublicProfile['activeTournaments'][number] | null>(null);
  const [isCurrentMember, setIsCurrentMember] = useState(false);
  const [isCurrentClubAdmin, setIsCurrentClubAdmin] = useState(false);
  const [clubMemberNames, setClubMemberNames] = useState<string[]>([]);
  const [applicationInbox, setApplicationInbox] = useState<ClubApplicationView[]>([]);
  const [isInboxLoading, setIsInboxLoading] = useState(false);

  const isFeaturedMember =
    !!session?.user.roles.isRegisteredPlayer &&
    !!state.item &&
    state.item.featuredPlayers.some((name) => name.trim().toLowerCase() === session.user.displayName.trim().toLowerCase());

  useEffect(() => {
    if (!session?.user.roles.isRegisteredPlayer || !state.item) {
      setIsCurrentMember(false);
      setIsCurrentClubAdmin(false);
      return;
    }

    let cancelled = false;
    const operatorId = session.user.operatorId ?? session.user.userId;
    const clubId = state.item.id;
    const refreshMembershipStatus = () => {
      void loadPlayerContext(operatorId, session.user.displayName).then((result) => {
        if (!cancelled) {
          setIsCurrentMember(result.player?.clubIds?.includes(clubId) ?? false);
        }
      });
      void clubsApi.getClubs({ adminId: operatorId, limit: 100, offset: 0 }).then((envelope) => {
        if (!cancelled) {
          setIsCurrentClubAdmin(envelope.items.some((club) => club.id === clubId));
        }
      }).catch(() => {
        if (!cancelled) {
          setIsCurrentClubAdmin(false);
        }
      });
    };

    refreshMembershipStatus();
    window.addEventListener('focus', refreshMembershipStatus);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', refreshMembershipStatus);
    };
  }, [isApplicationDialogOpen, session, state.item]);

  useEffect(() => {
    if (!session?.user.roles.isRegisteredPlayer || !state.item || !isCurrentClubAdmin) {
      setApplicationInbox([]);
      setIsInboxLoading(false);
      return;
    }

    let cancelled = false;
    const operatorId = session.user.operatorId ?? session.user.userId;
    setIsInboxLoading(true);

    void clubsApi
      .getClubApplications(state.item.id, {
        operatorId,
        status: 'Pending',
        limit: 20,
        offset: 0,
      })
      .then((envelope) => {
        if (!cancelled) {
          setApplicationInbox(envelope.items);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApplicationInbox([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsInboxLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isCurrentClubAdmin, session, state.item]);

  useEffect(() => {
    if (!state.item) {
      setClubMemberNames([]);
      return;
    }

    let cancelled = false;

    void clubsApi
      .getClubMembers(state.item.id, { limit: 100, offset: 0 })
      .then((envelope) => {
        if (!cancelled) {
          setClubMemberNames(envelope.items.map((item) => item.displayName).filter((name) => name.trim().length > 0));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setClubMemberNames([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [state.item]);

  if (!state.item) {
    return <PublicDetailNotFound title="Club not found" />;
  }

  const profile = state.item;
  const clubSummary = {
    id: profile.id,
    name: profile.name,
    memberCount: profile.memberCount,
    powerRating: profile.powerRating,
    treasury: profile.treasury,
    relations: profile.relations,
  };
  const isClubMember = isCurrentMember || isFeaturedMember;
  const featuredPlayerNames = Array.from(
    new Map(
      [...profile.featuredPlayers, ...clubMemberNames].map((name) => [
        name.trim().toLowerCase(),
        name,
      ]),
    ).values(),
  );
  const canApply = !!session?.user.roles.isRegisteredPlayer && !isClubMember;
  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const actionableTournaments = profile.activeTournaments.filter(
    (item) => item.source === 'invited' && item.status !== 'Finished',
  );
  const canManageLineup =
    !!session?.user.roles.isRegisteredPlayer && isCurrentClubAdmin && actionableTournaments.length > 0;

  async function handleReview(applicationId: string, decision: 'approve' | 'reject') {
    if (!profile.id || !operatorId) {
      return;
    }

    const confirmed = await confirmDanger({
      title: decision === 'approve' ? '通过这条申请？' : '拒绝这条申请？',
      message:
        decision === 'approve'
          ? '这会把当前申请标记为通过，并刷新俱乐部申请列表。'
          : '这会把当前申请标记为拒绝，并刷新俱乐部申请列表。',
      confirmText: decision === 'approve' ? '通过' : '拒绝',
    });

    if (!confirmed) {
      return;
    }

    const application = applicationInbox.find((item) => item.applicationId === applicationId);

    const result = await clubsApi.reviewClubApplication(profile.id, applicationId, {
      operatorId,
      decision,
      note: `${decision}d from club detail`,
      ...(decision === 'approve' && application?.applicant.playerId
        ? { playerId: application.applicant.playerId }
        : {}),
    }).then(() => ({ source: 'api' as const }))
      .catch(() => ({ source: 'mock' as const, warning: '审批请求未成功返回，列表将仅做本地刷新。' }));

    notifyMutationResult(result, {
      successTitle: decision === 'approve' ? '申请已通过' : '申请已拒绝',
      successMessage: '俱乐部申请列表已刷新。',
      fallbackTitle: decision === 'approve' ? '申请已通过（回退）' : '申请已拒绝（回退）',
      fallbackMessage: '审批已尝试执行，但当前只完成了本地刷新。',
    });

    setApplicationInbox((current) => current.filter((item) => item.applicationId !== applicationId));

    if (result.source === 'api') {
      onRefreshDetail?.();
    }
  }

  return (
    <>
      <DetailPageShell
        backLink={
          <Link className="detail-back" to="/public" reloadDocument>
            Back to public hall
          </Link>
        }
        hero={
          <DetailHero
            eyebrow="Club"
            title={profile.name}
            tagline={profile.slogan}
            summary={profile.description}
            actions={
              <div className="flex flex-wrap items-center gap-3">
                {isClubMember ? <StatusPill tone="success">你已经是俱乐部成员</StatusPill> : null}
                {!isClubMember && canApply ? (
                  <Button variant="secondary" onClick={() => setIsApplicationDialogOpen(true)}>
                    我想申请加入这个俱乐部
                  </Button>
                ) : null}
              </div>
            }
            source={state.source}
            warning={state.warning}
          />
        }
      >
        <section className="detail-grid grid gap-[22px] md:grid-cols-2">
          <DetailCard title="Public club info">
            <DetailList>
              <DetailListItem label="Members" value={profile.memberCount} />
              <DetailListItem label="Power" value={<StatusPill tone="warning">{profile.powerRating}</StatusPill>} />
              <DetailListItem label="Treasury" value={formatNumber(profile.treasury)} />
              <DetailListItem label="Relations" value={profile.relations.map(getRelationLabel).join(' / ') || '--'} />
              <DetailListItem label="Featured players" value={featuredPlayerNames.join(' / ') || '--'} />
            </DetailList>
          </DetailCard>
          <DetailCard title="Recent tournaments">
            <DetailRows>
              {profile.activeTournaments.length > 0 ? (
                profile.activeTournaments.map((item) => (
                  <DetailRow
                    key={item.id}
                    title={item.name}
                    detail={
                      <span className="inline-flex flex-wrap items-center gap-3">
                        <span>{item.source === 'invited' ? '已被邀请参赛' : '来自俱乐部公开资料接口'}</span>
                        <Link className="detail-link inline-flex" to={`/public/tournaments/${item.id}`}>
                          查看赛事详情
                        </Link>
                        {canManageLineup && item.source === 'invited' && item.status !== 'Finished' ? (
                          <button
                            type="button"
                            className="detail-link inline-flex cursor-pointer border-0 bg-transparent p-0"
                            onClick={() => {
                              setSelectedLineupTournament(item);
                              setIsLineupDialogOpen(true);
                            }}
                          >
                            拉人参赛
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
        </section>
        {isCurrentClubAdmin ? (
          <section className="detail-grid grid gap-[22px]">
            <DetailCard title="俱乐部加入申请审批">
              {isInboxLoading ? (
                <p className="m-0 text-[color:var(--muted)]">正在加载待审批申请...</p>
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
                          <ActionButton onClick={() => void handleReview(item.applicationId, 'approve')}>
                            通过
                          </ActionButton>
                          <ActionButton onClick={() => void handleReview(item.applicationId, 'reject')}>
                            拒绝
                          </ActionButton>
                        </>
                      ) : null,
                  }))}
                  emptyText="当前没有待审批的加入申请。"
                />
              )}
            </DetailCard>
          </section>
        ) : null}
      </DetailPageShell>
      {canApply ? (
        <ClubApplicationDialog
          club={clubSummary}
          open={isApplicationDialogOpen}
          onOpenChange={setIsApplicationDialogOpen}
          onMembershipConfirmed={() => {
            setIsCurrentMember(true);
            onRefreshDetail?.();
          }}
        />
      ) : null}
      {canManageLineup ? (
        <ClubTournamentLineupDialog
          clubId={profile.id}
          operatorId={operatorId}
          tournament={selectedLineupTournament}
          open={isLineupDialogOpen}
          onOpenChange={(nextOpen) => {
            setIsLineupDialogOpen(nextOpen);
            if (!nextOpen) {
              setSelectedLineupTournament(null);
            }
          }}
        />
      ) : null}
    </>
  );
};
