import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { clubsApi } from '@/api/clubs';
import { operationsApi } from '@/api/operations';
import { DetailCard, DetailHero, DetailList, DetailListItem, DetailPageShell, DetailRow, DetailRows, DirectoryCard, InfoSummaryCard, InfoSummaryGrid, PortalSection } from '@/components/shared/data-display';
import { ClubApplicationList } from '@/components/shared/domain';
import { EmptyState } from '@/components/shared/feedback';
import { CheckboxField, SelectField } from '@/components/shared/forms';
import { ActionButton, FilterActionRow } from '@/components/shared/layout';
import { Badge, Button, DescriptionItem, DescriptionList, Dialog, DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogSurface, DialogTitle, KeyValueItem, KeyValueList, LoadingProgress, StatusPill, Tabs, TabsList, TabsTrigger } from '@/components/ui';
import type {
  ClubPublicProfile,
  ClubApplicationView,
  ClubSummary,
  PlayerLeaderboardEntry,
  PublicSchedule,
  TournamentPublicProfile,
} from '@/domain/models';
import { mockClubProfiles } from '@/mocks/overview';
import { useDialog, useMutationNotice } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import { loadPlayerContext } from '@/features/blueprint/application-data';

import type { DetailState, LoadState, PublicHallState, PublicView } from './types';
import { ClubApplicationDialog } from './ClubApplicationDialog';
import { ClubTournamentLineupDialog } from './ClubTournamentLineupDialog';
import { CreateTournamentDialog } from './CreateTournamentDialog';
import {
  formatDateTime,
  formatNumber,
  getLeaderboardStatusLabel,
  getRelationLabel,
  getStageStatusLabel,
  getTournamentStatusLabel,
} from './utils';

export const PublicHallLoading = () => {
  return (
    <section className="public-portal">
      <section className="portal-hero portal-hero--loading grid gap-[22px] lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
        <div className="portal-hero__main relative overflow-hidden rounded-[var(--radius-xl)] p-[38px] shadow-[var(--shadow-lg)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))]">
          <p className="portal-hero__eyebrow">Guest Lobby</p>
          <h1>Loading public hall...</h1>
          <p className="portal-hero__summary">Fetching public schedules, club cards, and leaderboard data.</p>
          <LoadingProgress
            className="mt-6 max-w-[420px]"
            label="大厅加载中"
            message="正在同步公开赛程、俱乐部目录和首页摘要。"
            indeterminate
            tone="warm"
          />
        </div>
      </section>
    </section>
  );
};

export const PublicHallError = ({ message }: { message: string }) => {
  return (
    <section className="public-portal">
      <section className="portal-hero portal-hero--loading grid gap-[22px] lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
        <div className="portal-hero__main relative overflow-hidden rounded-[var(--radius-xl)] p-[38px] shadow-[var(--shadow-lg)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))]">
          <p className="portal-hero__eyebrow">Guest Lobby</p>
          <h1>Public hall failed to render</h1>
          <p className="portal-hero__summary">{message}</p>
        </div>
      </section>
    </section>
  );
}

export const PublicHallHero = ({
  schedules,
  leaderboard,
  clubs,
  onSelectView,
}: {
  schedules: LoadState<PublicSchedule>;
  leaderboard: LoadState<PlayerLeaderboardEntry> | null;
  clubs: LoadState<ClubSummary>;
  onSelectView: (view: PublicView) => void;
}) => {
  const nextSchedule = schedules.envelope.items[0];
  const topPlayer = leaderboard?.envelope.items[0];
  const featuredClub = clubs.envelope.items[0];

  return (
    <section className="portal-hero grid gap-[22px] lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
      <div className="portal-hero__main relative overflow-hidden rounded-[var(--radius-xl)] p-[38px] shadow-[var(--shadow-lg)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))] before:pointer-events-none before:absolute before:inset-[auto_-5%_-18%_auto] before:h-[260px] before:w-[260px] before:rounded-full before:bg-[radial-gradient(circle,rgba(114,216,209,0.16),transparent_70%)] before:content-['']">
        <div className="portal-hero__badge-row flex items-center gap-[14px]">
          <p className="portal-hero__eyebrow">Guest Lobby</p>
          <Badge className="portal-inline-badge" variant={schedules.source === 'api' ? 'success' : 'warning'}>
            {schedules.source === 'api' ? 'Public API' : 'Mock'}
          </Badge>
        </div>
        <h1>Public Hall</h1>
        <p className="portal-hero__summary">
          Public hall home now loads schedules, clubs, and leaderboard data directly from lightweight public
          endpoints.
        </p>
        <InfoSummaryGrid className="portal-hero__highlights">
          <InfoSummaryCard
            className="portal-highlight"
            label="Next featured stage"
            title={nextSchedule ? nextSchedule.stageName : 'No schedule yet'}
            detail={nextSchedule ? formatDateTime(nextSchedule.scheduledAt) : 'Waiting for schedule data'}
            detailAs="small"
          />
          <InfoSummaryCard
            className="portal-highlight"
            label="Current top player"
            title={topPlayer ? topPlayer.nickname : '--'}
            detail={topPlayer ? `${topPlayer.clubName} / ELO ${topPlayer.elo}` : 'Waiting for leaderboard data'}
            detailAs="small"
          />
        </InfoSummaryGrid>
        <div className="portal-hero__quicklinks">
          <Button className="portal-chip" variant="chip" onClick={() => onSelectView('schedules')}>
            Schedules
          </Button>
          <Button className="portal-chip" variant="chip" onClick={() => onSelectView('clubs')}>
            Clubs
          </Button>
          <Button className="portal-chip" variant="chip" onClick={() => onSelectView('leaderboard')}>
            Leaderboard
          </Button>
        </div>
      </div>
      <aside className="portal-hero__aside grid gap-[22px]">
        <InfoSummaryCard
          className="portal-stat portal-stat--accent"
          label="Next public tournament"
          title={nextSchedule ? nextSchedule.tournamentName : '--'}
          detail={
            nextSchedule
              ? `${nextSchedule.stageName} / ${formatDateTime(nextSchedule.scheduledAt)}`
              : 'No upcoming schedule'
          }
          detailAs="small"
        />
        <InfoSummaryCard
          className="portal-stat"
          label="Visible clubs"
          title={clubs.envelope.total}
          detail={featuredClub ? `${featuredClub.name} / Power ${featuredClub.powerRating}` : 'Waiting for club data'}
          detailAs="small"
        />
        <InfoSummaryCard
          className="portal-stat"
          label="Default leaderboard filter"
          title={getLeaderboardStatusLabel('Active')}
          detail="Showing active players first"
          detailAs="small"
        />
      </aside>
    </section>
  );
}

export const PublicHallOverviewStrip = ({
  schedules,
  leaderboard,
  clubs,
}: {
  schedules: LoadState<PublicSchedule>;
  leaderboard: LoadState<PlayerLeaderboardEntry> | null;
  clubs: LoadState<ClubSummary>;
}) => {
  const cards = [
    {
      title: 'Public schedules',
      value: `${schedules.envelope.total}`,
      detail: schedules.envelope.items[0]
        ? `${schedules.envelope.items[0].tournamentName} currently featured`
        : 'Waiting for schedule data',
    },
    {
      title: 'Club directory',
      value: `${clubs.envelope.total}`,
      detail: clubs.envelope.items[0]
        ? `${clubs.envelope.items[0].name} in the current public set`
        : 'Waiting for club data',
    },
    {
      title: 'Player leaderboard',
      value: leaderboard ? `${leaderboard.envelope.total}` : '--',
      detail: leaderboard?.envelope.items[0]
        ? `${leaderboard.envelope.items[0].nickname} currently leads`
        : 'Waiting for leaderboard data',
    },
  ];

  return (
    <InfoSummaryGrid className="portal-overview grid gap-[22px] md:grid-cols-3">
      {cards.map((card) => (
        <InfoSummaryCard
          key={card.title}
          className="overview-card rounded-[22px] bg-[color:var(--bg-soft)] px-[22px] py-5 [&_strong]:my-2 [&_strong]:block [&_strong]:text-[2rem] [&_strong]:text-[color:var(--text)] [&_strong]:drop-shadow-[0_4px_18px_rgba(3,8,14,0.22)]"
          label={card.title}
          title={card.value}
          detail={card.detail}
          detailAs="small"
        />
      ))}
    </InfoSummaryGrid>
  );
};

export const PublicHallLeaderboardLoading = () => {
  return (
    <PortalSection
      eyebrow="排行榜"
      title="玩家排行榜"
      description="排行榜改为按需加载，减少公共大厅首屏等待。"
      source="api"
    >
      <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[color:var(--panel)] px-6 py-7 shadow-[var(--shadow-md)]">
        <LoadingProgress
          label="排行榜加载中"
          message="正在按需请求玩家排行榜数据。"
          indeterminate
        />
      </div>
    </PortalSection>
  );
};

const getStatusTone = (value: string): 'neutral' | 'info' | 'success' | 'warning' | 'danger' => {
  const normalized = value.toLowerCase();

  if (normalized.includes('active') || normalized.includes('approved') || normalized.includes('finished')) {
    return 'success';
  }

  if (normalized.includes('progress') || normalized.includes('registration') || normalized.includes('scoring')) {
    return 'info';
  }

  if (normalized.includes('pending') || normalized.includes('draft') || normalized.includes('open')) {
    return 'warning';
  }

  if (normalized.includes('banned') || normalized.includes('reject') || normalized.includes('appeal')) {
    return 'danger';
  }

  return 'neutral';
};

export const PublicHallTabs = ({
  activeView,
  onSelectView,
}: {
  activeView: PublicView;
  onSelectView: (view: PublicView) => void;
}) => {
  const tabs: Array<{ id: PublicView; label: string; summary: string }> = [
    { id: 'schedules', label: 'Schedules', summary: 'Browse public tournament stages and timing.' },
    { id: 'clubs', label: 'Clubs', summary: 'Browse public club cards and open profiles.' },
    { id: 'leaderboard', label: 'Leaderboard', summary: 'Check ELO ranking and player status.' },
  ];

  return (
    <Tabs value={activeView} onValueChange={(value) => onSelectView(value as PublicView)} className="portal-tabs-shell">
      <TabsList className="portal-tabs grid gap-[14px] md:grid-cols-3" aria-label="Public hall navigation">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="portal-tab cursor-pointer">
            <strong>{tab.label}</strong>
            <span>{tab.summary}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export const PublicSchedulesSection = ({
  payload,
  state,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<PublicSchedule>;
  state: PublicHallState;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) => {
  const { session } = useAuth();
  const [isCreateTournamentOpen, setIsCreateTournamentOpen] = useState(false);
  const canCreateTournament = !!session?.user.roles.isSuperAdmin;

  return (
    <>
      <PortalSection
        eyebrow="赛程"
        title="公开赛程"
        description="来自 GET /public/schedules，并在页面本地完成筛选。"
        source={payload.source}
        warning={payload.warning}
      >
        <FilterActionRow onRefresh={onRefresh}>
          <SelectField
            label="赛事状态"
            value={state.scheduleTournamentStatus}
            onChange={(event) =>
              onStateChange({
                scheduleTournamentStatus: event.currentTarget.value as PublicHallState['scheduleTournamentStatus'],
              })
            }
          >
            <option value="">全部</option>
            <option value="Draft">草稿</option>
            <option value="RegistrationOpen">报名中</option>
            <option value="InProgress">进行中</option>
            <option value="Finished">已结束</option>
          </SelectField>
          <SelectField
            label="阶段状态"
            value={state.scheduleStageStatus}
            onChange={(event) =>
              onStateChange({
                scheduleStageStatus: event.currentTarget.value as PublicHallState['scheduleStageStatus'],
              })
            }
          >
            <option value="">全部</option>
            <option value="Pending">待开始</option>
            <option value="Active">进行中</option>
            <option value="Completed">已完成</option>
          </SelectField>
          {canCreateTournament ? (
            <ActionButton variant="secondary" onClick={() => setIsCreateTournamentOpen(true)}>
              新建比赛
            </ActionButton>
          ) : null}
        </FilterActionRow>
        <div className="schedule-grid grid gap-[22px] md:grid-cols-2">
          {payload.envelope.items.length > 0 ? (
            payload.envelope.items.map((item) => (
              <DirectoryCard
                key={`${item.tournamentId}-${item.stageId}`}
                className="schedule-card"
                top={
                  <div className="schedule-card__top flex items-start justify-between gap-[14px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill
                        className="schedule-card__status bg-[rgba(114,216,209,0.14)] text-[color:var(--teal-strong)]"
                        tone={getStatusTone(item.tournamentStatus)}
                      >
                        {getTournamentStatusLabel(item.tournamentStatus)}
                      </StatusPill>
                      {item.isUnpublished ? <StatusPill tone="warning">未发布</StatusPill> : null}
                    </div>
                    <StatusPill className="schedule-card__minor text-[color:var(--muted)]" tone={getStatusTone(item.stageStatus)}>
                      {getStageStatusLabel(item.stageStatus)}
                    </StatusPill>
                  </div>
                }
                title={item.tournamentName}
                subtitle={item.stageName}
                meta={
                  <DescriptionList className="schedule-card__meta mt-0 grid gap-3">
                    <DescriptionItem
                      className="grid gap-[10px] sm:grid-cols-2 sm:items-start"
                      label="开始时间"
                      value={formatDateTime(item.scheduledAt)}
                    />
                    <DescriptionItem
                      className="grid gap-[10px] sm:grid-cols-2 sm:items-start"
                      label="赛事 ID"
                      value={item.tournamentId}
                      separator={false}
                    />
                  </DescriptionList>
                }
                action={
                  <Link className="detail-link inline-flex mt-[18px]" to={`/public/tournaments/${item.tournamentId}`}>
                    打开赛事详情
                  </Link>
                }
              />
            ))
          ) : (
            <EmptyState>当前筛选条件下没有可显示的赛程。</EmptyState>
          )}
        </div>
      </PortalSection>
      {canCreateTournament ? (
        <CreateTournamentDialog open={isCreateTournamentOpen} onOpenChange={setIsCreateTournamentOpen} />
      ) : null}
    </>
  );
};

export const PublicClubsSection = ({
  payload,
  state,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<ClubSummary>;
  state: PublicHallState;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) => {
  return (
    <PortalSection
      eyebrow="Clubs"
      title="Club Directory"
      description="Loaded from GET /public/clubs and adapted into the frontend club-card model."
      source={payload.source}
      warning={payload.warning}
    >
      <FilterActionRow onRefresh={onRefresh}>
        <CheckboxField
          label="Prefer active clubs only"
          checked={state.clubActiveOnly}
          onChange={(event) => onStateChange({ clubActiveOnly: event.currentTarget.checked })}
        />
      </FilterActionRow>
      <div className="club-grid grid gap-[22px] md:grid-cols-2">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((club) => (
            <DirectoryCard
              key={club.id}
              className="club-card"
              top={
                <div className="club-card__top flex items-start justify-between gap-[14px]">
                  <div>
                    <p className="club-card__subtitle">{club.memberCount} members</p>
                  </div>
                  <StatusPill className="club-card__power bg-[rgba(236,197,122,0.14)] text-[color:var(--gold)]" tone="warning">
                    Power {club.powerRating}
                  </StatusPill>
                </div>
              }
              title={club.name}
              summary="Public club cards expose high-level profile, treasury, and relation summary only."
              meta={
                <KeyValueList className="club-card__stats mt-0 grid gap-[10px] sm:grid-cols-2">
                  <KeyValueItem label="Treasury" value={formatNumber(club.treasury)} />
                  <KeyValueItem label="Relations" value={club.relations.map(getRelationLabel).join(' / ') || '--'} />
                </KeyValueList>
              }
              action={
                <Link className="detail-link inline-flex mt-[18px]" to={`/public/clubs/${club.id}`}>
                  Open club detail
                </Link>
              }
            />
          ))
        ) : (
          <EmptyState>No public clubs are available right now.</EmptyState>
        )}
      </div>
    </PortalSection>
  );
};

export const PublicLeaderboardSection = ({
  payload,
  state,
  clubs,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<PlayerLeaderboardEntry>;
  state: PublicHallState;
  clubs: ClubSummary[];
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) => {
  return (
    <PortalSection
      eyebrow="Leaderboard"
      title="Player Leaderboard"
      description="Loaded from GET /public/leaderboards/players and joined with club names in the API client."
      source={payload.source}
      warning={payload.warning}
    >
      <FilterActionRow onRefresh={onRefresh}>
        <SelectField
          label="Club"
          value={state.leaderboardClubId}
          onChange={(event) => onStateChange({ leaderboardClubId: event.currentTarget.value })}
        >
            <option value="">All clubs</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
        </SelectField>
        <SelectField
          label="Status"
          value={state.leaderboardStatus}
          onChange={(event) =>
            onStateChange({ leaderboardStatus: event.currentTarget.value as PublicHallState['leaderboardStatus'] })
          }
        >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Banned">Banned</option>
        </SelectField>
      </FilterActionRow>
      <ol className="leaderboard-list m-0 grid list-none gap-[22px] p-0">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((item, index) => {
            const club = mockClubProfiles.find((profile) => profile.name === item.clubName);

            return (
              <li key={item.playerId} className="leaderboard-row grid items-center gap-4 rounded-3xl bg-[color:var(--panel)] px-5 py-[18px] md:grid-cols-[72px_minmax(0,1fr)_auto]">
                <div className="leaderboard-row__rank inline-flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[linear-gradient(145deg,rgba(236,197,122,0.16),rgba(114,216,209,0.16)),rgba(255,255,255,0.02)] text-[1.1rem] font-bold">{item.rank || index + 1}</div>
                <div className="leaderboard-row__main">
                  <strong>{item.nickname}</strong>
                  <span>{item.clubName || '--'}</span>
                  {club ? (
                    <Link className="leaderboard-row__link inline-flex mt-[18px]" to={`/public/clubs/${club.id}`}>
                      Open club
                    </Link>
                  ) : null}
                </div>
                <div className="leaderboard-row__side text-right">
                  <strong>ELO {item.elo}</strong>
                  <span>{getLeaderboardStatusLabel(item.status)}</span>
                </div>
              </li>
            );
          })
        ) : (
          <EmptyState>No leaderboard rows match the current filters.</EmptyState>
        )}
      </ol>
    </PortalSection>
  );
};

export const PublicTournamentDetailSection = ({
  state,
  stages,
}: {
  state: DetailState<TournamentPublicProfile>;
  stages: NonNullable<TournamentPublicProfile['stages']>;
}) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [availableClubs, setAvailableClubs] = useState<ClubSummary[]>([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [isSubmittingTournamentAction, setIsSubmittingTournamentAction] = useState(false);
  const [publishBlockedOpen, setPublishBlockedOpen] = useState(false);
  const [localProfile, setLocalProfile] = useState<TournamentPublicProfile | null>(state.item);

  useEffect(() => {
    setLocalProfile(state.item);
  }, [state.item]);

  useEffect(() => {
    if (!session?.user.roles.isRegisteredPlayer || !(session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin)) {
      return;
    }

    let cancelled = false;
    void clubsApi
      .getClubs({ limit: 100, offset: 0 })
      .then((envelope) => {
        if (!cancelled) {
          setAvailableClubs(envelope.items);
          setSelectedClubId((current) => current || envelope.items[0]?.id || '');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableClubs([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  if (!state.item) {
    return <PublicDetailNotFound title="Tournament not found" />;
  }

  const profile = localProfile ?? state.item;
  const operatorId = session?.user.operatorId ?? session?.user.userId;
  const canManageTournament =
    !!session?.user.roles.isRegisteredPlayer &&
    (session.user.roles.isSuperAdmin || session.user.roles.isTournamentAdmin);
  const canPublishTournament = canManageTournament && profile.status === 'Draft';
  const invitedClubIds = profile.clubIds ?? [];
  const invitedClubs = availableClubs.filter((club) => invitedClubIds.includes(club.id));
  const selectableClubs = availableClubs.filter((club) => !invitedClubIds.includes(club.id));

  const handleInviteClub = async () => {
    if (!profile.id || !selectedClubId || !operatorId) {
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      await operationsApi.registerTournamentClub(profile.id, selectedClubId, operatorId);
      setLocalProfile((current) =>
        current
          ? {
              ...current,
              clubIds: Array.from(new Set([...(current.clubIds ?? []), selectedClubId])),
              clubCount: (current.clubCount ?? 0) + 1,
              whitelistType:
                current.playerCount && current.playerCount > 0
                  ? 'Mixed'
                  : 'Club',
            }
          : current,
      );
      setSelectedClubId(selectableClubs.find((club) => club.id !== selectedClubId)?.id ?? '');
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  };

  const handlePublishTournament = async () => {
    if (!operatorId || !profile.id) {
      return;
    }

    if ((profile.clubIds?.length ?? 0) === 0) {
      setPublishBlockedOpen(true);
      return;
    }

    try {
      setIsSubmittingTournamentAction(true);
      await operationsApi.publishTournament(profile.id, operatorId);
      setLocalProfile((current) => (current ? { ...current, status: 'RegistrationOpen' } : current));
      navigate('/public');
    } finally {
      setIsSubmittingTournamentAction(false);
    }
  };

  return (
    <>
      <DetailPageShell
        backLink={
          <Link className="detail-back" to="/public">
            返回公共大厅
          </Link>
        }
        hero={
          <DetailHero
            eyebrow="赛事"
            title={profile.name}
            tagline={profile.tagline}
            summary={profile.description}
            actions={
              canPublishTournament ? (
                <Button variant="secondary" onClick={() => void handlePublishTournament()} disabled={isSubmittingTournamentAction}>
                  发布比赛
                </Button>
              ) : null
            }
            source={state.source}
            warning={state.warning}
          />
        }
      >
        <section className="detail-grid grid gap-[22px] md:grid-cols-2">
          <DetailCard title={<span className="text-[1.25rem] font-semibold">赛事信息</span>}>
            <DetailList>
              <DetailListItem
                label="状态"
                value={<StatusPill tone={getStatusTone(profile.status)}>{getTournamentStatusLabel(profile.status)}</StatusPill>}
              />
              <DetailListItem label="主办方" value={profile.venue} />
              <DetailListItem label="阶段数量" value={profile.stageCount} />
              <DetailListItem label="白名单类型" value={profile.whitelistType} />
              <DetailListItem label="俱乐部数量" value={profile.clubCount ?? profile.clubIds?.length ?? 0} />
              <DetailListItem label="玩家数量" value={profile.playerCount ?? 0} />
              <DetailListItem label="白名单数量" value={profile.whitelistCount ?? 0} />
              <DetailListItem label="下一阶段" value={profile.nextStageName} />
              <DetailListItem label="开始时间" value={formatDateTime(profile.nextScheduledAt)} />
            </DetailList>
          </DetailCard>
          <div className="grid gap-[22px]">
            <DetailCard
              title={
                <span className="text-[1.25rem] font-semibold">
                  {invitedClubs.length > 0 ? '参赛俱乐部名单' : '邀请俱乐部'}
                </span>
              }
            >
              <div className="grid gap-4">
                {canManageTournament ? (
                  <>
                    <p className="m-0 text-[color:var(--muted)]">
                      后端已支持将俱乐部注册到赛事中。请先邀请俱乐部，再发布比赛。
                    </p>
                    <SelectField
                      label="俱乐部"
                      value={selectedClubId}
                      onChange={(event) => setSelectedClubId(event.currentTarget.value)}
                      disabled={isSubmittingTournamentAction || selectableClubs.length === 0}
                    >
                      {selectableClubs.length > 0 ? (
                        selectableClubs.map((club) => (
                          <option key={club.id} value={club.id}>
                            {club.name}
                          </option>
                        ))
                      ) : (
                        <option value="">没有更多可邀请的俱乐部</option>
                      )}
                    </SelectField>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => void handleInviteClub()}
                        disabled={!selectedClubId || isSubmittingTournamentAction || selectableClubs.length === 0}
                      >
                        邀请俱乐部
                      </Button>
                    </div>
                  </>
                ) : null}
                {invitedClubs.length > 0 ? (
                  <DetailRows>
                    {invitedClubs.map((club) => (
                      <DetailRow
                        key={club.id}
                        title={club.name}
                        detail={`${club.memberCount} 名成员 / 战力 ${club.powerRating}`}
                      />
                    ))}
                  </DetailRows>
                ) : (
                  <EmptyState asListItem={false}>
                    {canManageTournament ? '暂时还没有邀请任何俱乐部。' : '当前还没有公布参赛俱乐部名单。'}
                  </EmptyState>
                )}
              </div>
            </DetailCard>
            <DetailCard title="阶段概览">
              <DetailRows>
                {stages.map((stage) => (
                  <DetailRow
                    key={stage.stageId}
                    title={stage.name}
                    detail={
                      <>
                        <StatusPill tone={getStatusTone(stage.status)}>{getStageStatusLabel(stage.status)}</StatusPill>
                        {' / '}
                        {stage.tableCount} tables / {stage.roundCount} rounds
                      </>
                    }
                  />
                ))}
              </DetailRows>
            </DetailCard>
          </div>
        </section>
      </DetailPageShell>
      <Dialog open={publishBlockedOpen} onOpenChange={setPublishBlockedOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogSurface>
            <DialogHeader className="border-b border-[color:var(--line)] px-6 py-5">
              <DialogTitle>暂时无法发布</DialogTitle>
              <DialogDescription>请先选择邀请的俱乐部，再发布这场比赛。</DialogDescription>
            </DialogHeader>
            <DialogBody className="px-6 py-5">
              <p className="m-0 text-[color:var(--muted)]">
                请先在右侧邀请俱乐部区域至少添加一个俱乐部，然后再尝试发布。
              </p>
            </DialogBody>
            <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5">
              <Button variant="secondary" onClick={() => setPublishBlockedOpen(false)}>
                关闭
              </Button>
            </DialogFooter>
          </DialogSurface>
        </DialogPortal>
      </Dialog>
    </>
  );
};

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

export const PublicDetailNotFound = ({ title }: { title: string }) => {
  return (
    <DetailPageShell
      backLink={
        <Link className="detail-back" to="/public">
          Back to public hall
        </Link>
      }
      hero={
        <DetailHero
          eyebrow="Not Found"
          title={title}
          summary="The requested public detail view is not available right now."
        />
      }
    />
  );
};
