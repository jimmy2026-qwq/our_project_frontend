import { Link } from 'react-router-dom';

import {
  DetailCard,
  DetailList,
  DetailListItem,
  DetailRow,
  DetailRows,
} from '@/components/shared/data-display';
import { EmptyState } from '@/components/shared/feedback';
import { SelectField } from '@/components/shared/forms';
import {
  Button,
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  StatusPill,
} from '@/components/ui';
import type { ClubSummary, TournamentPublicProfile } from '@/domain/public';

import { formatDateTime, getStageStatusLabel, getTournamentStatusLabel } from '../utils';
import { getStatusTone } from './shared';
import { getTableStatusLabel, getTableStatusTone } from './tournament-detail.hooks';
import type { TournamentDetailTableItem } from './tournament-detail.types';

export function TournamentOverviewPanel({
  profile,
  showMoreInfo,
  onToggleShowMore,
}: {
  profile: TournamentPublicProfile;
  showMoreInfo: boolean;
  onToggleShowMore: () => void;
}) {
  return (
    <DetailCard title={<span className="text-[1.25rem] font-semibold">赛事信息</span>}>
      <div className="grid gap-4">
        <DetailList>
          <DetailListItem
            label="状态"
            value={<StatusPill tone={getStatusTone(profile.status)}>{getTournamentStatusLabel(profile.status)}</StatusPill>}
          />
          <DetailListItem label="主办方" value={profile.venue} />
          {showMoreInfo ? (
            <>
              <DetailListItem label="阶段数" value={profile.stageCount} />
              <DetailListItem label="参赛类型" value={profile.whitelistType} />
              <DetailListItem label="俱乐部数量" value={profile.clubCount ?? profile.clubIds?.length ?? 0} />
              <DetailListItem label="玩家数量" value={profile.playerCount ?? 0} />
              <DetailListItem label="白名单数量" value={profile.whitelistCount ?? 0} />
              <DetailListItem label="下一阶段" value={profile.nextStageName} />
              <DetailListItem label="下一次排程时间" value={formatDateTime(profile.nextScheduledAt)} />
            </>
          ) : null}
        </DetailList>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={onToggleShowMore}>
            {showMoreInfo ? '收起详情' : '展开详情'}
          </Button>
        </div>
      </div>
    </DetailCard>
  );
}

export function TournamentTablesPanel({
  visibleTables,
  playerNames,
  canManageTournament,
}: {
  visibleTables: TournamentDetailTableItem[];
  playerNames: Record<string, string>;
  canManageTournament: boolean;
}) {
  return (
    <DetailCard title={<span className="text-[1.25rem] font-semibold">对局信息</span>}>
      <div className="grid gap-4">
        {visibleTables.length > 0 ? (
          <DetailRows>
            {visibleTables.map((table) => {
              const playerLabel = table.playerIds.map((playerId) => playerNames[playerId] ?? playerId).join(' / ');
              const isFinished = table.status === 'Archived';

              return (
                <DetailRow
                  key={table.id}
                  title={`${table.tableCode} / ${table.stageName}`}
                  detail={
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusPill tone={getTableStatusTone(table.status)}>{getTableStatusLabel(table.status)}</StatusPill>
                      <span>{playerLabel}</span>
                      <Link className="detail-link inline-flex" to={isFinished ? `/tables/${table.id}/paifu` : `/tables/${table.id}`}>
                        {isFinished ? '查看牌谱' : '进入牌桌'}
                      </Link>
                    </div>
                  }
                />
              );
            })}
          </DetailRows>
        ) : (
          <EmptyState asListItem={false}>
            {canManageTournament
              ? '当前还没有安排好的对局，请先生成对局名单。'
              : '当前还没有可公开查看的对局。'}
          </EmptyState>
        )}
      </div>
    </DetailCard>
  );
}

export function TournamentInvitedClubsPanel({
  invitedClubs,
  selectableClubs,
  selectedClubId,
  canManageTournament,
  isSubmittingTournamentAction,
  onSelectedClubIdChange,
  onInviteClub,
}: {
  invitedClubs: ClubSummary[];
  selectableClubs: ClubSummary[];
  selectedClubId: string;
  canManageTournament: boolean;
  isSubmittingTournamentAction: boolean;
  onSelectedClubIdChange: (value: string) => void;
  onInviteClub: () => void;
}) {
  return (
    <DetailCard title={<span className="text-[1.25rem] font-semibold">{invitedClubs.length > 0 ? '参赛俱乐部名单' : '邀请俱乐部'}</span>}>
      <div className="grid gap-4">
        {canManageTournament ? (
          <>
            <p className="m-0 text-[color:var(--muted)]">
              将俱乐部加入本赛事参赛名单。新邀请的俱乐部会立即出现在下方列表中。
            </p>
            <SelectField
              label="俱乐部"
              value={selectedClubId}
              onChange={(event) => onSelectedClubIdChange(event.currentTarget.value)}
              disabled={isSubmittingTournamentAction || selectableClubs.length === 0}
            >
              {selectableClubs.length > 0 ? (
                selectableClubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name}
                  </option>
                ))
              ) : (
                <option value="">没有可邀请的俱乐部</option>
              )}
            </SelectField>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onInviteClub}
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
                title={
                  <Link className="detail-link inline-flex" to={`/public/clubs/${club.id}`}>
                    {club.name}
                  </Link>
                }
                detail={`${club.memberCount} 名成员 / 战力 ${club.powerRating}`}
              />
            ))}
          </DetailRows>
        ) : (
          <EmptyState asListItem={false}>
            {canManageTournament ? '当前还没有俱乐部加入这场比赛。' : '当前还没有公布参赛俱乐部名单。'}
          </EmptyState>
        )}
      </div>
    </DetailCard>
  );
}

export function TournamentStagesPanel({
  stages,
}: {
  stages: NonNullable<TournamentPublicProfile['stages']>;
}) {
  return (
    <DetailCard title="阶段信息">
      <DetailRows>
        {stages.map((stage) => (
          <DetailRow
            key={stage.stageId}
            title={stage.name}
            detail={
              <>
                <StatusPill tone={getStatusTone(stage.status)}>{getStageStatusLabel(stage.status)}</StatusPill>
                {' / '}
                {stage.tableCount} 桌 / {stage.roundCount} 轮
              </>
            }
          />
        ))}
      </DetailRows>
    </DetailCard>
  );
}

export function PublishBlockedDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface>
          <DialogHeader className="border-b border-[color:var(--line)] px-6 py-5">
            <DialogTitle>暂时无法发布比赛</DialogTitle>
            <DialogDescription>请先至少选择一个参赛俱乐部，再发布这场比赛。</DialogDescription>
          </DialogHeader>
          <DialogBody className="px-6 py-5">
            <p className="m-0 text-[color:var(--muted)]">请先邀请或登记俱乐部参赛，然后再尝试发布。</p>
          </DialogBody>
          <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
