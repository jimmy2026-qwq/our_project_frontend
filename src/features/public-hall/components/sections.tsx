import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  ActionButton,
  CheckboxField,
  EmptyState,
  FilterActionRow,
  PortalSection,
  SelectField,
  StatusPill,
} from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import type {
  ClubSummary,
  PlayerLeaderboardEntry,
  PublicSchedule,
} from '@/objects/publicquery';

import { CreateClubDialog } from '../CreateClubDialog';
import { CreateTournamentDialog } from '../CreateTournamentDialog';
import { ManagePlayerDialog } from '../ManagePlayerDialog';
import type { LoadState, PublicHallState } from '../types';
import {
  formatDateTime,
  formatNumber,
  getLeaderboardStatusLabel,
  getRelationLabel,
  getTournamentStatusLabel,
} from '../utils';
import { getStatusTone } from './shared.status';

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
        className="public-schedules-section"
        eyebrow="赛程"
        title={
          <div className="public-schedules__title-row">
            <span>公开赛程</span>
            {canCreateTournament ? (
              <ActionButton
                className="public-schedules__create-button"
                variant="secondary"
                size="sm"
                onClick={() => setIsCreateTournamentOpen(true)}
              >
                创建比赛
              </ActionButton>
            ) : null}
          </div>
        }
        description="查看当前公共大厅中的公开赛事、赛事状态和阶段进度。"
        source={payload.source}
        warning={payload.warning}
      >
        <FilterActionRow
          className="public-schedules__filters"
          onRefresh={onRefresh}
        >
          <SelectField
            label="赛事状态"
            value={state.scheduleTournamentStatus}
            onChange={(event) =>
              onStateChange({
                scheduleTournamentStatus: event.currentTarget
                  .value as PublicHallState['scheduleTournamentStatus'],
              })
            }
          >
            <option value="">全部状态</option>
            <option value="Draft">草稿</option>
            <option value="RegistrationOpen">报名中</option>
            <option value="InProgress">进行中</option>
            <option value="Finished">已结束</option>
          </SelectField>
          <SelectField
            label="赛事阶段"
            value={state.scheduleStageStatus}
            onChange={(event) =>
              onStateChange({
                scheduleStageStatus: event.currentTarget
                  .value as PublicHallState['scheduleStageStatus'],
              })
            }
          >
            <option value="">全部阶段</option>
            <option value="Pending">未开始</option>
            <option value="Active">进行中</option>
            <option value="Completed">已完成</option>
          </SelectField>
        </FilterActionRow>
        <section className="tournament-detail-list">
          <div className="tournament-detail-list__body tournament-detail-list__body--cards public-schedules__grid">
            {payload.envelope.items.length > 0 ? (
              payload.envelope.items.map((item) => (
                <article
                  key={`${item.tournamentId}-${item.stageId}`}
                  className="tournament-detail-list__row public-directory-card"
                >
                  <div className="tournament-detail-list__row-main public-directory-card__main">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong>{item.tournamentName}</strong>
                      {item.isUnpublished ? (
                        <StatusPill tone="warning">未发布</StatusPill>
                      ) : null}
                    </div>
                    <span>{item.stageName}</span>
                    <span>{`开始时间：${formatDateTime(item.scheduledAt)}`}</span>
                  </div>
                  <div className="tournament-detail-list__row-side">
                    <StatusPill
                      className="schedule-card__status bg-[rgba(114,216,209,0.14)] text-[color:var(--teal-strong)]"
                      tone={getStatusTone(item.tournamentStatus)}
                    >
                      {getTournamentStatusLabel(item.tournamentStatus)}
                    </StatusPill>
                    <Link
                      className="detail-link tournament-detail-list__action"
                      to={`/public/tournaments/${item.tournamentId}`}
                    >
                      查看赛事详情
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState>当前没有可展示的公开赛程。</EmptyState>
            )}
          </div>
        </section>
      </PortalSection>
      {canCreateTournament ? (
        <CreateTournamentDialog
          open={isCreateTournamentOpen}
          onOpenChange={setIsCreateTournamentOpen}
        />
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
        className="public-directory-section"
        eyebrow="俱乐部"
        title={
          <div className="public-schedules__title-row">
            <span>俱乐部名录</span>
            {canCreateClub ? (
              <ActionButton
                className="public-schedules__create-button"
                variant="secondary"
                size="sm"
                onClick={() => setIsCreateClubOpen(true)}
              >
                创建俱乐部
              </ActionButton>
            ) : null}
          </div>
        }
        description="查看当前公共大厅可浏览的俱乐部信息、成员规模和基础战力概览。"
        source={payload.source}
        warning={payload.warning}
      >
        <FilterActionRow
          className="public-schedules__filters"
          onRefresh={onRefresh}
        >
          <CheckboxField
            label="只显示可加入俱乐部"
            checked={state.clubActiveOnly}
            onChange={(event) =>
              onStateChange({ clubActiveOnly: event.currentTarget.checked })
            }
          />
        </FilterActionRow>
        <section className="tournament-detail-list">
          <div className="tournament-detail-list__body tournament-detail-list__body--cards public-directory__grid">
            {payload.envelope.items.length > 0 ? (
              payload.envelope.items.map((club) => (
                <article
                  key={club.id}
                  className="tournament-detail-list__row public-directory-card"
                >
                  <div className="tournament-detail-list__row-main public-directory-card__main">
                    <strong>{club.name}</strong>
                    <span>{`战力值：${club.powerRating}`}</span>
                    <span>{`金库：${formatNumber(club.treasury)}    关系：${club.relations.map(getRelationLabel).join(' / ') || '--'}`}</span>
                  </div>
                  <div className="tournament-detail-list__row-side">
                    <span>{`成员数：${club.memberCount}`}</span>
                    <Link
                      className="detail-link tournament-detail-list__action"
                      to={`/public/clubs/${club.id}`}
                    >
                      查看详情
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState>当前没有可展示的俱乐部名录。</EmptyState>
            )}
          </div>
        </section>
      </PortalSection>
      {canCreateClub ? (
        <CreateClubDialog
          open={isCreateClubOpen}
          onOpenChange={setIsCreateClubOpen}
        />
      ) : null}
    </>
  );
};

export const PublicLeaderboardSection = ({
  payload,
  state,
  clubs,
  onStateChange,
  onRefresh,
  onPlayerManaged,
}: {
  payload: LoadState<PlayerLeaderboardEntry>;
  state: PublicHallState;
  clubs: ClubSummary[];
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
  onPlayerManaged?: () => void;
}) => {
  const { session } = useAuth();
  const [managedPlayer, setManagedPlayer] =
    useState<PlayerLeaderboardEntry | null>(null);
  const canManagePlayers = !!session?.user.roles.isSuperAdmin;

  return (
    <>
      <PortalSection
        className="public-leaderboard-section"
        eyebrow="排行"
        title={
          <div className="public-schedules__title-row">
            <span>选手排名</span>
          </div>
        }
        description="查看当前公共大厅中的选手 Elo 排名、所属俱乐部和当前状态。"
        source={payload.source}
        warning={payload.warning}
      >
        <FilterActionRow
          className="public-schedules__filters"
          onRefresh={onRefresh}
        >
          <SelectField
            label="俱乐部"
            value={state.leaderboardClubId}
            onChange={(event) =>
              onStateChange({ leaderboardClubId: event.currentTarget.value })
            }
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
              onStateChange({
                leaderboardStatus: event.currentTarget
                  .value as PublicHallState['leaderboardStatus'],
              })
            }
          >
            <option value="">全部状态</option>
            <option value="Active">活跃</option>
            <option value="Inactive">停用</option>
            <option value="Banned">封禁</option>
          </SelectField>
        </FilterActionRow>
        <section className="tournament-detail-list">
          <div className="tournament-detail-list__body tournament-detail-list__body--cards public-leaderboard__list">
            {payload.envelope.items.length > 0 ? (
              payload.envelope.items.map((item, index) => {
                const linkedClub =
                  clubs.find((club) => item.clubIds?.includes(club.id)) ??
                  clubs.find((club) => club.name === item.clubName);

                return (
                  <article
                    key={item.playerId}
                    className="tournament-detail-list__row public-leaderboard__row"
                  >
                    <div className="tournament-detail-list__row-main">
                      <strong>{item.nickname}</strong>
                      <span>{`俱乐部：${item.clubName || '--'}`}</span>
                      <span>{`状态：${getLeaderboardStatusLabel(item.status)}`}</span>
                    </div>
                    <div className="tournament-detail-list__row-side">
                      <strong>{`ELO ${item.elo}`}</strong>
                      <span>{`排名：${item.rank || index + 1}`}</span>
                      {canManagePlayers || linkedClub ? (
                        <div className="tournament-detail-list__action-row">
                          {canManagePlayers ? (
                            <button
                              type="button"
                              className="detail-link tournament-detail-list__action"
                              onClick={() => setManagedPlayer(item)}
                            >
                              管理玩家
                            </button>
                          ) : null}
                          {linkedClub ? (
                            <Link
                              className="detail-link tournament-detail-list__action"
                              to={`/public/clubs/${linkedClub.id}`}
                            >
                              查看俱乐部
                            </Link>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })
            ) : (
              <EmptyState>当前没有可展示的选手排名。</EmptyState>
            )}
          </div>
        </section>
      </PortalSection>
      {canManagePlayers ? (
        <ManagePlayerDialog
          open={!!managedPlayer}
          player={managedPlayer}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setManagedPlayer(null);
            }
          }}
          onCompleted={onPlayerManaged}
        />
      ) : null}
    </>
  );
};
