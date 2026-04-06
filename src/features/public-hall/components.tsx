import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { DetailCard, DetailHero, DetailList, DetailListItem, DetailPageShell, DetailRow, DetailRows, DirectoryCard, InfoSummaryCard, InfoSummaryGrid, PortalSection } from '@/components/shared/data-display';
import { EmptyState } from '@/components/shared/feedback';
import { CheckboxField, SelectField } from '@/components/shared/forms';
import { FilterActionRow } from '@/components/shared/layout';
import { Badge, Button, DescriptionItem, DescriptionList, KeyValueItem, KeyValueList, StatusPill, Tabs, TabsList, TabsTrigger } from '@/components/ui';
import type {
  ClubPublicProfile,
  ClubSummary,
  PlayerLeaderboardEntry,
  PublicSchedule,
  TournamentPublicProfile,
} from '@/domain/models';
import { mockClubProfiles } from '@/mocks/overview';
import { useAuth } from '@/hooks/useAuth';
import { loadPlayerContext } from '@/features/blueprint/application-data';

import type { DetailState, LoadState, PublicHallState, PublicView } from './types';
import { ClubApplicationDialog } from './ClubApplicationDialog';
import {
  formatDateTime,
  formatNumber,
  getLeaderboardStatusLabel,
  getRelationLabel,
  getStageStatusLabel,
  getTournamentStatusLabel,
} from './utils';

export function PublicHallLoading() {
  return (
    <section className="public-portal">
      <section className="portal-hero portal-hero--loading grid gap-[22px] lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
        <div className="portal-hero__main relative overflow-hidden rounded-[var(--radius-xl)] p-[38px] shadow-[var(--shadow-lg)] bg-[radial-gradient(circle_at_top_right,rgba(236,197,122,0.14),transparent_30%),linear-gradient(180deg,rgba(20,39,58,0.95),rgba(8,18,29,0.9))]">
          <p className="portal-hero__eyebrow">Guest Lobby</p>
          <h1>Loading public hall...</h1>
          <p className="portal-hero__summary">Fetching public schedules, club cards, and leaderboard data.</p>
        </div>
      </section>
    </section>
  );
}

export function PublicHallError({ message }: { message: string }) {
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

export function PublicHallHero({
  schedules,
  leaderboard,
  clubs,
  onSelectView,
}: {
  schedules: LoadState<PublicSchedule>;
  leaderboard: LoadState<PlayerLeaderboardEntry>;
  clubs: LoadState<ClubSummary>;
  onSelectView: (view: PublicView) => void;
}) {
  const nextSchedule = schedules.envelope.items[0];
  const topPlayer = leaderboard.envelope.items[0];
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

export function PublicHallOverviewStrip({
  schedules,
  leaderboard,
  clubs,
}: {
  schedules: LoadState<PublicSchedule>;
  leaderboard: LoadState<PlayerLeaderboardEntry>;
  clubs: LoadState<ClubSummary>;
}) {
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
      value: `${leaderboard.envelope.total}`,
      detail: leaderboard.envelope.items[0]
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
}

function getStatusTone(value: string): 'neutral' | 'info' | 'success' | 'warning' | 'danger' {
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
}

export function PublicHallTabs({
  activeView,
  onSelectView,
}: {
  activeView: PublicView;
  onSelectView: (view: PublicView) => void;
}) {
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
}

export function PublicSchedulesSection({
  payload,
  state,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<PublicSchedule>;
  state: PublicHallState;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) {
  return (
    <PortalSection
      eyebrow="Schedules"
      title="Public Schedules"
      description="Loaded from GET /public/schedules and filtered locally in the page state."
      source={payload.source}
      warning={payload.warning}
    >
      <FilterActionRow onRefresh={onRefresh}>
        <SelectField
          label="Tournament status"
          value={state.scheduleTournamentStatus}
          onChange={(event) =>
            onStateChange({
              scheduleTournamentStatus: event.currentTarget.value as PublicHallState['scheduleTournamentStatus'],
            })
          }
        >
            <option value="">All</option>
            <option value="Draft">Draft</option>
            <option value="Registration">Registration</option>
            <option value="InProgress">In progress</option>
            <option value="Finished">Finished</option>
        </SelectField>
        <SelectField
          label="Stage status"
          value={state.scheduleStageStatus}
          onChange={(event) =>
            onStateChange({
              scheduleStageStatus: event.currentTarget.value as PublicHallState['scheduleStageStatus'],
            })
          }
        >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
        </SelectField>
      </FilterActionRow>
      <div className="schedule-grid grid gap-[22px] md:grid-cols-2">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((item) => (
            <DirectoryCard
              key={`${item.tournamentId}-${item.stageId}`}
              className="schedule-card"
              top={
                <div className="schedule-card__top flex items-start justify-between gap-[14px]">
                  <StatusPill
                    className="schedule-card__status bg-[rgba(114,216,209,0.14)] text-[color:var(--teal-strong)]"
                    tone={getStatusTone(item.tournamentStatus)}
                  >
                    {getTournamentStatusLabel(item.tournamentStatus)}
                  </StatusPill>
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
                    label="Starts"
                    value={formatDateTime(item.scheduledAt)}
                  />
                  <DescriptionItem
                    className="grid gap-[10px] sm:grid-cols-2 sm:items-start"
                    label="Tournament id"
                    value={item.tournamentId}
                    separator={false}
                  />
                </DescriptionList>
              }
              action={
                <Link className="detail-link inline-flex mt-[18px]" to={`/public/tournaments/${item.tournamentId}`}>
                  Open tournament detail
                </Link>
              }
            />
          ))
        ) : (
          <EmptyState>No public schedules match the current filters.</EmptyState>
        )}
      </div>
    </PortalSection>
  );
}

export function PublicClubsSection({
  payload,
  state,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<ClubSummary>;
  state: PublicHallState;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) {
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
}

export function PublicLeaderboardSection({
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
}) {
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
}

export function PublicTournamentDetailSection({
  state,
  stages,
}: {
  state: DetailState<TournamentPublicProfile>;
  stages: NonNullable<TournamentPublicProfile['stages']>;
}) {
  if (!state.item) {
    return <PublicDetailNotFound title="Tournament not found" />;
  }

  const profile = state.item;

  return (
    <DetailPageShell
      backLink={
        <Link className="detail-back" to="/public">
          Back to public hall
        </Link>
      }
      hero={
        <DetailHero
          eyebrow="Tournament"
          title={profile.name}
          tagline={profile.tagline}
          summary={profile.description}
          source={state.source}
          warning={state.warning}
        />
      }
    >
      <section className="detail-grid grid gap-[22px] md:grid-cols-2">
        <DetailCard title="Public tournament info">
          <DetailList>
            <DetailListItem
              label="Status"
              value={<StatusPill tone={getStatusTone(profile.status)}>{getTournamentStatusLabel(profile.status)}</StatusPill>}
            />
            <DetailListItem label="Organizer" value={profile.venue} />
            <DetailListItem label="Stage count" value={profile.stageCount} />
            <DetailListItem label="Whitelist type" value={profile.whitelistType} />
            <DetailListItem label="Next stage" value={profile.nextStageName} />
            <DetailListItem label="Start time" value={formatDateTime(profile.nextScheduledAt)} />
          </DetailList>
        </DetailCard>
        <DetailCard title="Stage overview">
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
      </section>
    </DetailPageShell>
  );
}

export function PublicClubDetailSection({ state }: { state: DetailState<ClubPublicProfile> }) {
  const { session } = useAuth();
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isCurrentMember, setIsCurrentMember] = useState(false);

  const isFeaturedMember =
    !!session?.user.roles.isRegisteredPlayer &&
    !!state.item &&
    state.item.featuredPlayers.some((name) => name.trim().toLowerCase() === session.user.displayName.trim().toLowerCase());

  useEffect(() => {
    if (!session?.user.roles.isRegisteredPlayer || !state.item) {
      setIsCurrentMember(false);
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
    };

    refreshMembershipStatus();
    window.addEventListener('focus', refreshMembershipStatus);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', refreshMembershipStatus);
    };
  }, [isApplicationDialogOpen, session, state.item]);

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
  const canApply = !!session?.user.roles.isRegisteredPlayer && !isClubMember;

  return (
    <>
      <DetailPageShell
        backLink={
          <Link className="detail-back" to="/public">
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
              isClubMember ? (
                <StatusPill tone="success">你已经是俱乐部成员</StatusPill>
              ) : canApply ? (
                <Button variant="secondary" onClick={() => setIsApplicationDialogOpen(true)}>
                  我想申请加入这个俱乐部
                </Button>
              ) : null
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
              <DetailListItem label="Featured players" value={profile.featuredPlayers.join(' / ') || '--'} />
            </DetailList>
          </DetailCard>
          <DetailCard title="Recent tournaments">
            <DetailRows>
              {profile.activeTournaments.length > 0 ? (
                profile.activeTournaments.map((item) => (
                  <DetailRow key={item} title={item} detail="Visible from the public club profile endpoint." />
                ))
              ) : (
                <EmptyState asListItem>No recent tournament entries were returned.</EmptyState>
              )}
            </DetailRows>
          </DetailCard>
        </section>
      </DetailPageShell>
      {canApply ? (
        <ClubApplicationDialog
          club={clubSummary}
          open={isApplicationDialogOpen}
          onOpenChange={setIsApplicationDialogOpen}
          onMembershipConfirmed={() => setIsCurrentMember(true)}
        />
      ) : null}
    </>
  );
}

export function PublicDetailNotFound({ title }: { title: string }) {
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
}
