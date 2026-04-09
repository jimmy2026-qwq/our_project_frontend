import { useState } from 'react';
import { Link } from 'react-router-dom';

import { DirectoryCard, PortalSection } from '@/components/shared/data-display';
import { EmptyState } from '@/components/shared/feedback';
import { CheckboxField, SelectField } from '@/components/shared/forms';
import { ActionButton, FilterActionRow } from '@/components/shared/layout';
import { DescriptionItem, DescriptionList, KeyValueItem, KeyValueList, StatusPill } from '@/components/ui';
import type { ClubSummary, PlayerLeaderboardEntry, PublicSchedule } from '@/domain/public';
import { mockClubProfiles } from '@/mocks/overview';
import { useAuth } from '@/hooks/useAuth';

import { CreateTournamentDialog } from '../CreateTournamentDialog';
import type { LoadState, PublicHallState } from '../types';
import {
  formatDateTime,
  formatNumber,
  getLeaderboardStatusLabel,
  getRelationLabel,
  getStageStatusLabel,
  getTournamentStatusLabel,
} from '../utils';
import { getStatusTone } from './shared';

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
