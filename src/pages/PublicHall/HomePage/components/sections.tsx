import { useState } from 'react';
import type { ClubSummary } from '@/pages/objects/club';
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
import type {
  PlayerLeaderboardEntry,
  PublicSchedule,
} from '@/pages/PublicHall/objects';

import { CreateClubDialog } from './CreateClubDialog';
import { CreateTournamentDialog } from './CreateTournamentDialog';
import { ManagePlayerDialog } from './ManagePlayerDialog';
import type { LoadState, PublicHallState } from '@/pages/PublicHall/objects/types';
import {
  formatDateTime,
  formatNumber,
  getLeaderboardStatusLabel,
  getRelationLabel,
  getTournamentStatusLabel,
  STAGE_STATUS_FILTER_OPTIONS,
  TOURNAMENT_STATUS_FILTER_OPTIONS,
} from '@/pages/PublicHall/objects/utils';
import { getStatusTone } from '@/pages/PublicHall/components/shared.status';

const hallSectionClassNames = {
  section:
    'flex h-[calc(100vh-250px)] max-h-[calc(100vh-250px)] min-h-[calc(100vh-250px)] flex-col !rounded-3xl border !border-[rgba(219,175,98,0.28)] !bg-[rgba(9,18,31,0.76)] ![background-image:none] shadow-[0_14px_32px_rgba(5,10,18,0.14),inset_0_1px_0_rgba(255,255,255,0.04)] max-[980px]:h-auto max-[980px]:max-h-none max-[980px]:min-h-0',
  head: 'relative !block items-start',
  headContent: 'grid w-full',
  ornament: 'hidden',
  sourceBadge: 'hidden',
  eyebrow: 'justify-self-start',
  title: 'mt-1.5 w-full text-center',
  description: 'text-center',
  titleRow:
    'grid w-full grid-cols-[1fr_auto_1fr] items-center [&>span]:col-start-2 [&>span]:min-w-[220px] [&>span]:justify-self-center [&>span]:border [&>span]:!border-[rgba(219,175,98,0.46)] [&>span]:bg-[rgba(28,31,68,0.9)] [&>span]:bg-[linear-gradient(180deg,rgba(42,47,90,0.92),rgba(28,31,68,0.9))] [&>span]:px-7 [&>span]:py-2 [&>span]:text-[rgba(239,189,111,0.98)] [&>span]:shadow-[inset_0_1px_0_rgba(255,236,204,0.14),0_6px_16px_rgba(10,12,30,0.14)]',
  titleBadge:
    'col-start-2 min-w-[220px] justify-self-center border !border-[rgba(219,175,98,0.46)] bg-[rgba(28,31,68,0.9)] bg-[linear-gradient(180deg,rgba(42,47,90,0.92),rgba(28,31,68,0.9))] px-7 py-2 text-[rgba(239,189,111,0.98)] shadow-[inset_0_1px_0_rgba(255,236,204,0.14),0_6px_16px_rgba(10,12,30,0.14)]',
  createButton:
    'col-start-3 min-h-10 min-w-28 justify-self-end !rounded-none !border !border-[rgba(208,161,89,0.86)] !bg-[linear-gradient(180deg,rgba(235,198,126,0.98),rgba(212,168,95,0.96))] px-4 py-2 !text-[0.9rem] !font-bold !leading-[1.1] !text-[rgba(44,24,8,0.96)] shadow-[inset_0_1px_0_rgba(255,241,208,0.36),0_8px_16px_rgba(37,24,9,0.12)] [text-shadow:none]',
  filters:
    'flex-none items-center gap-x-[18px] gap-y-3 [&_label]:!flex [&_label]:!min-w-0 [&_label]:items-center [&_label]:gap-2.5 [&_label_span]:whitespace-nowrap [&_select]:min-w-[148px]',
  list: 'grid h-full min-h-0 grid-rows-[minmax(0,1fr)] gap-[14px]',
  listBody:
    'grid h-full max-h-full min-h-0 flex-1 content-start gap-[14px] overflow-x-hidden overflow-y-auto pr-2.5 [scrollbar-color:rgba(245,214,146,0.46)_rgba(10,18,31,0.18)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[rgba(10,18,31,0.18)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[linear-gradient(180deg,rgba(245,214,146,0.7),rgba(208,170,98,0.7))]',
  row:
    'grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 gap-y-[14px] rounded-none border-2 !border-[rgba(219,175,98,0.42)] !bg-[rgba(40,62,112,0.24)] ![background-image:none] px-[18px] py-4 shadow-none max-[980px]:grid-cols-1',
  rowMain:
    'grid gap-2 [&_span]:text-[rgba(225,230,243,0.92)] [&_strong]:text-[rgba(239,189,111,0.96)]',
  scheduleName:
    'text-left text-[clamp(1.3rem,2vw,1.8rem)] font-bold text-[rgba(239,189,111,0.96)]',
  rowSide:
    'grid min-w-[132px] items-center justify-items-end gap-2 text-[rgba(225,230,243,0.92)] max-[980px]:justify-items-start',
  leaderboardSide:
    'grid min-w-[168px] justify-items-end gap-2 text-[rgba(225,230,243,0.92)] max-[980px]:justify-items-start',
  actionRow:
    'flex flex-nowrap items-center justify-end gap-2.5 max-[980px]:flex-wrap max-[980px]:justify-start',
  action:
    'mt-0 inline-flex min-w-28 cursor-pointer items-center justify-center justify-self-end border !border-[rgba(219,175,98,0.36)] bg-[rgba(56,85,162,0.92)] bg-[linear-gradient(180deg,rgba(83,124,210,0.92),rgba(56,85,162,0.92))] px-[22px] py-2.5 text-center text-[#f5c98e] no-underline',
  status: 'bg-[rgba(114,216,209,0.14)] text-[#8fe8e1]',
};

const publicHallSectionSlots = {
  ornament: hallSectionClassNames.ornament,
  head: hallSectionClassNames.head,
  headContent: hallSectionClassNames.headContent,
  eyebrow: hallSectionClassNames.eyebrow,
  title: hallSectionClassNames.title,
  description: hallSectionClassNames.description,
  sourceBadge: hallSectionClassNames.sourceBadge,
};

export const PublicSchedulesSection = ({
  payload,
  state,
  canCreateTournament,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<PublicSchedule>;
  state: PublicHallState;
  canCreateTournament: boolean;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) => {
  const [isCreateTournamentOpen, setIsCreateTournamentOpen] = useState(false);

  return (
    <>
      <PortalSection
        className={hallSectionClassNames.section}
        slotClassNames={publicHallSectionSlots}
        eyebrow="赛程"
        title={
          <div className={hallSectionClassNames.titleRow}>
            <span>公开赛程</span>
            {canCreateTournament ? (
              <ActionButton
                className={hallSectionClassNames.createButton}
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
          className={hallSectionClassNames.filters}
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
            {TOURNAMENT_STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
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
            {STAGE_STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </FilterActionRow>
        <section className={hallSectionClassNames.list}>
          <div className={hallSectionClassNames.listBody}>
            {payload.envelope.items.length > 0 ? (
              payload.envelope.items.map((item) => (
                <article
                  key={`${item.tournamentId}-${item.stageId}`}
                  className={hallSectionClassNames.row}
                >
                  <div className={hallSectionClassNames.rowMain}>
                    <div className="flex flex-wrap items-center gap-2">
                      <strong>{item.tournamentName}</strong>
                      {item.isUnpublished ? (
                        <StatusPill tone="warning">未发布</StatusPill>
                      ) : null}
                    </div>
                    <span>{item.stageName}</span>
                    <span>{`开始时间：${formatDateTime(item.scheduledAt)}`}</span>
                  </div>
                  <div className={hallSectionClassNames.rowSide}>
                    <StatusPill
                      className={hallSectionClassNames.status}
                      tone={getStatusTone(item.tournamentStatus)}
                    >
                      {getTournamentStatusLabel(item.tournamentStatus)}
                    </StatusPill>
                    <Link
                      className={hallSectionClassNames.action}
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
  canCreateClub,
  onStateChange,
  onRefresh,
}: {
  payload: LoadState<ClubSummary>;
  state: PublicHallState;
  canCreateClub: boolean;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
}) => {
  const [isCreateClubOpen, setIsCreateClubOpen] = useState(false);

  return (
    <>
      <PortalSection
        className={hallSectionClassNames.section}
        slotClassNames={publicHallSectionSlots}
        eyebrow="俱乐部"
        title={
          <div className={hallSectionClassNames.titleRow}>
            <span>俱乐部名录</span>
            {canCreateClub ? (
              <ActionButton
                className={hallSectionClassNames.createButton}
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
          className={hallSectionClassNames.filters}
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
        <section className={hallSectionClassNames.list}>
          <div className={hallSectionClassNames.listBody}>
            {payload.envelope.items.length > 0 ? (
              payload.envelope.items.map((club) => (
                <article
                  key={club.id}
                  className={hallSectionClassNames.row}
                >
                  <div className={hallSectionClassNames.rowMain}>
                    <strong>{club.name}</strong>
                    <span>{`战力值：${club.powerRating}`}</span>
                    <span>{`金库：${formatNumber(club.treasury)}    关系：${club.relations.map(getRelationLabel).join(' / ') || '--'}`}</span>
                  </div>
                  <div className={hallSectionClassNames.rowSide}>
                    <span>{`成员数：${club.memberCount}`}</span>
                    <Link
                      className={hallSectionClassNames.action}
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
  canManagePlayers,
  onStateChange,
  onRefresh,
  onPlayerManaged,
}: {
  payload: LoadState<PlayerLeaderboardEntry>;
  state: PublicHallState;
  clubs: ClubSummary[];
  canManagePlayers: boolean;
  onStateChange: (patch: Partial<PublicHallState>) => void;
  onRefresh: () => void;
  onPlayerManaged?: () => void;
}) => {
  const [managedPlayer, setManagedPlayer] =
    useState<PlayerLeaderboardEntry | null>(null);

  return (
    <>
      <PortalSection
        className={hallSectionClassNames.section}
        slotClassNames={publicHallSectionSlots}
        eyebrow="排行"
        title={
          <div className={hallSectionClassNames.titleRow}>
            <span>选手排名</span>
          </div>
        }
        description="查看当前公共大厅中的选手 Elo 排名、所属俱乐部和当前状态。"
        source={payload.source}
        warning={payload.warning}
      >
        <FilterActionRow
          className={hallSectionClassNames.filters}
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
        <section className={hallSectionClassNames.list}>
          <div className={hallSectionClassNames.listBody}>
            {payload.envelope.items.length > 0 ? (
              payload.envelope.items.map((item, index) => {
                const linkedClub =
                  clubs.find((club) => item.clubIds?.includes(club.id)) ??
                  clubs.find((club) => club.name === item.clubName);

                return (
                  <article
                    key={item.playerId}
                    className={hallSectionClassNames.row}
                  >
                    <div className={hallSectionClassNames.rowMain}>
                      <strong>{item.nickname}</strong>
                      <span>{`俱乐部：${item.clubName || '--'}`}</span>
                      <span>{`状态：${getLeaderboardStatusLabel(item.status)}`}</span>
                    </div>
                    <div className={hallSectionClassNames.leaderboardSide}>
                      <strong>{`ELO ${item.elo}`}</strong>
                      <span>{`排名：${item.rank || index + 1}`}</span>
                      {canManagePlayers || linkedClub ? (
                        <div className={hallSectionClassNames.actionRow}>
                          {canManagePlayers ? (
                            <button
                              type="button"
                              className={hallSectionClassNames.action}
                              onClick={() => setManagedPlayer(item)}
                            >
                              管理玩家
                            </button>
                          ) : null}
                          {linkedClub ? (
                            <Link
                              className={hallSectionClassNames.action}
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
