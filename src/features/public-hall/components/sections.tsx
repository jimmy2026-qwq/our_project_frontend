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

import { CreateClubDialog } from '../CreateClubDialog';
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
        title={
          <div className="flex flex-wrap items-center gap-3">
            <span>公共赛程</span>
            {canCreateTournament ? (
              <ActionButton variant="secondary" onClick={() => setIsCreateTournamentOpen(true)}>
                新建比赛
              </ActionButton>
            ) : null}
          </div>
        }
        description="这里展示当前公开可见的赛事和阶段安排。"
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
            <option value="Draft">未发布</option>
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
            <option value="Pending">未开始</option>
            <option value="Active">进行中</option>
            <option value="Completed">已完成</option>
          </SelectField>
        </FilterActionRow>
        <div className="schedule-grid grid gap-[22px]">
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
                      label="赛事编号"
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
            <EmptyState>当前没有符合条件的公开赛程。</EmptyState>
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
  const { session } = useAuth();
  const [isCreateClubOpen, setIsCreateClubOpen] = useState(false);
  const canCreateClub = !!session?.user.roles.isRegisteredPlayer;

  return (
    <>
      <PortalSection
        eyebrow="俱乐部"
        title={
          <div className="flex flex-wrap items-center gap-3">
            <span>Club Directory</span>
            {canCreateClub ? (
              <ActionButton
                className="px-3 py-2 text-[0.82rem]"
                variant="secondary"
                onClick={() => setIsCreateClubOpen(true)}
              >
                创建俱乐部
              </ActionButton>
            ) : null}
          </div>
        }
        description="这里展示当前公开可见的俱乐部名录和基础信息。"
        source={payload.source}
        warning={payload.warning}
      >
        <FilterActionRow onRefresh={onRefresh}>
          <CheckboxField
            label="仅显示活跃俱乐部"
            checked={state.clubActiveOnly}
            onChange={(event) => onStateChange({ clubActiveOnly: event.currentTarget.checked })}
          />
        </FilterActionRow>
        <div className="club-grid grid gap-[22px]">
          {payload.envelope.items.length > 0 ? (
            payload.envelope.items.map((club) => (
              <DirectoryCard
                key={club.id}
                className="club-card"
                top={
                  <div className="club-card__top flex items-start justify-between gap-[14px]">
                    <div>
                      <p className="club-card__subtitle">{club.memberCount} 名成员</p>
                    </div>
                    <StatusPill className="club-card__power bg-[rgba(236,197,122,0.14)] text-[color:var(--gold)]" tone="warning">
                      战力 {club.powerRating}
                    </StatusPill>
                  </div>
                }
                title={club.name}
                summary="公开俱乐部卡片只展示俱乐部的基础资料、资金和关系摘要。"
                meta={
                  <KeyValueList className="club-card__stats mt-0 grid gap-[10px] sm:grid-cols-2">
                    <KeyValueItem label="资金" value={formatNumber(club.treasury)} />
                    <KeyValueItem label="关系" value={club.relations.map(getRelationLabel).join(' / ') || '--'} />
                  </KeyValueList>
                }
                action={
                  <Link className="detail-link inline-flex mt-[18px]" to={`/public/clubs/${club.id}`}>
                    打开俱乐部详情
                  </Link>
                }
              />
            ))
          ) : (
            <EmptyState>当前没有可公开查看的俱乐部。</EmptyState>
          )}
        </div>
      </PortalSection>
      {canCreateClub ? <CreateClubDialog open={isCreateClubOpen} onOpenChange={setIsCreateClubOpen} /> : null}
    </>
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
      eyebrow="排行榜"
      title="玩家排行榜"
      description="这里展示公开排行榜中的玩家表现。"
      source={payload.source}
      warning={payload.warning}
    >
      <FilterActionRow onRefresh={onRefresh}>
        <SelectField
          label="俱乐部"
          value={state.leaderboardClubId}
          onChange={(event) => onStateChange({ leaderboardClubId: event.currentTarget.value })}
        >
          <option value="">全部俱乐部</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="状态"
          value={state.leaderboardStatus}
          onChange={(event) =>
            onStateChange({ leaderboardStatus: event.currentTarget.value as PublicHallState['leaderboardStatus'] })
          }
        >
          <option value="">全部</option>
          <option value="Active">活跃</option>
          <option value="Inactive">未活跃</option>
          <option value="Banned">封禁</option>
        </SelectField>
      </FilterActionRow>
      <ol className="leaderboard-list m-0 grid list-none gap-[22px] p-0">
        {payload.envelope.items.length > 0 ? (
          payload.envelope.items.map((item, index) => {
            const club = mockClubProfiles.find((profile) => profile.name === item.clubName);

            return (
              <li key={item.playerId} className="leaderboard-row grid items-center gap-4 rounded-3xl bg-[color:var(--panel)] px-5 py-[18px] md:grid-cols-[72px_minmax(0,1fr)_auto]">
                <div className="leaderboard-row__rank inline-flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-[linear-gradient(145deg,rgba(236,197,122,0.16),rgba(114,216,209,0.16)),rgba(255,255,255,0.02)] text-[1.1rem] font-bold">
                  {item.rank || index + 1}
                </div>
                <div className="leaderboard-row__main">
                  <strong>{item.nickname}</strong>
                  <span>{item.clubName || '--'}</span>
                  {club ? (
                    <Link className="leaderboard-row__link inline-flex mt-[18px]" to={`/public/clubs/${club.id}`}>
                      打开俱乐部
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
          <EmptyState>当前筛选条件下没有排行榜数据。</EmptyState>
        )}
      </ol>
    </PortalSection>
  );
};
