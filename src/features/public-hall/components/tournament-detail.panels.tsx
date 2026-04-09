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
    <DetailCard title={<span className="text-[1.25rem] font-semibold">Tournament overview</span>}>
      <div className="grid gap-4">
        <DetailList>
          <DetailListItem
            label="Status"
            value={<StatusPill tone={getStatusTone(profile.status)}>{getTournamentStatusLabel(profile.status)}</StatusPill>}
          />
          <DetailListItem label="Organizer / venue" value={profile.venue} />
          {showMoreInfo ? (
            <>
              <DetailListItem label="Stage count" value={profile.stageCount} />
              <DetailListItem label="Whitelist type" value={profile.whitelistType} />
              <DetailListItem label="Club count" value={profile.clubCount ?? profile.clubIds?.length ?? 0} />
              <DetailListItem label="Player count" value={profile.playerCount ?? 0} />
              <DetailListItem label="Whitelist count" value={profile.whitelistCount ?? 0} />
              <DetailListItem label="Next stage" value={profile.nextStageName} />
              <DetailListItem label="Next scheduled time" value={formatDateTime(profile.nextScheduledAt)} />
            </>
          ) : null}
        </DetailList>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={onToggleShowMore}>
            {showMoreInfo ? 'Show less' : 'Show more'}
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
    <DetailCard title={<span className="text-[1.25rem] font-semibold">Tournament tables</span>}>
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
                        {isFinished ? 'Open paifu' : 'Open table'}
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
              ? 'No tables are available yet. Schedule the next stage to populate the table queue.'
              : 'No public tables are visible yet.'}
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
    <DetailCard
      title={<span className="text-[1.25rem] font-semibold">{invitedClubs.length > 0 ? 'Participating clubs' : 'Invite clubs'}</span>}
    >
      <div className="grid gap-4">
        {canManageTournament ? (
          <>
            <p className="m-0 text-[color:var(--muted)]">
              Invite clubs into the tournament roster. Newly invited clubs will immediately appear in the participating list.
            </p>
            <SelectField
              label="Club"
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
                <option value="">No clubs available to invite</option>
              )}
            </SelectField>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={onInviteClub}
                disabled={!selectedClubId || isSubmittingTournamentAction || selectableClubs.length === 0}
              >
                Invite club
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
                detail={`${club.memberCount} members / Power ${club.powerRating}`}
              />
            ))}
          </DetailRows>
        ) : (
          <EmptyState asListItem={false}>
            {canManageTournament ? 'No clubs have been added to this tournament yet.' : 'No clubs are visible yet.'}
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
    <DetailCard title="Stages">
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
            <DialogTitle>Cannot publish yet</DialogTitle>
            <DialogDescription>Add at least one participating club before publishing this tournament.</DialogDescription>
          </DialogHeader>
          <DialogBody className="px-6 py-5">
            <p className="m-0 text-[color:var(--muted)]">
              Invite or register a club first, then try publishing again.
            </p>
          </DialogBody>
          <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
