import { Link } from 'react-router-dom';

import { EmptyState } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { ClubSummary } from '@/pages/objects/club';
import type { PlayerProfile } from '@/pages/objects/player';

import { participantText } from '../../../objects/tournament-participants-text';
import { LineupRoster, ToggleArrow } from './TournamentParticipantsShared';
import type { LineupSubmission } from '../hooks/TournamentDetailParticipantsLineup.hooks';
import type { TournamentDetailWorkbenchState } from '../../../../../objects/tournament-detail.types';

function ClubParticipantRow({
  club,
  clubExpanded,
  lineupCount,
  submission,
  lineupPlayersById,
  loadingLineupPlayerIds,
  onToggle,
}: {
  club: ClubSummary;
  clubExpanded: boolean;
  lineupCount: number;
  submission?: LineupSubmission;
  lineupPlayersById: Record<string, PlayerProfile>;
  loadingLineupPlayerIds: string[];
  onToggle: () => void;
}) {
  const activePlayerIds = submission?.activePlayerIds ?? [];
  const reservePlayerIds = submission?.reservePlayerIds ?? [];
  const activePlayers = activePlayerIds.flatMap((playerId) =>
    lineupPlayersById[playerId] ? [lineupPlayersById[playerId]] : [],
  );
  const reservePlayers = reservePlayerIds.flatMap((playerId) =>
    lineupPlayersById[playerId] ? [lineupPlayersById[playerId]] : [],
  );
  const missingPlayerIds = [...activePlayerIds, ...reservePlayerIds].filter(
    (playerId) => !lineupPlayersById[playerId],
  );
  const isLoadingLineup = missingPlayerIds.some((playerId) =>
    loadingLineupPlayerIds.includes(playerId),
  );

  return (
    <article className="grid gap-3 rounded-[18px] border border-[rgba(176,223,229,0.14)] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <Link
            className="font-semibold text-[#8fe8e1] no-underline hover:text-[#b2f4ef]"
            to={`/public/clubs/${club.id}`}
          >
            {club.name}
          </Link>
          <span
            className={cx(
              'inline-flex w-fit items-center justify-center rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap',
              lineupCount > 0
                ? 'border-[rgba(114,216,209,0.3)] bg-[rgba(114,216,209,0.14)] text-[#8fe8e1]'
                : 'border-[rgba(236,197,122,0.3)] bg-[rgba(236,197,122,0.14)] text-[#ecc57a]',
            )}
          >
            {lineupCount > 0
              ? `${participantText.confirmed} ${lineupCount} ${participantText.people}`
              : participantText.pending}
          </span>
          <span className="text-sm text-[#9ab0c1]">
            {club.memberCount} {participantText.members} /{' '}
            {participantText.power} {club.powerRating}
          </span>
        </div>
        <ToggleArrow
          expanded={clubExpanded}
          label={
            clubExpanded
              ? participantText.collapseMembers
              : participantText.expandMembers
          }
          onClick={onToggle}
        />
      </div>
      {clubExpanded ? (
        <LineupRoster
          activePlayers={activePlayers}
          reservePlayers={reservePlayers}
          missingPlayerIds={isLoadingLineup ? [] : missingPlayerIds}
          isLoading={isLoadingLineup}
        />
      ) : null}
    </article>
  );
}

export function ClubParticipantList({
  workbench,
  expandedClubIds,
  lineupSubmissionByClubId,
  lineupPlayersById,
  loadingLineupPlayerIds,
  onToggleClubRoster,
}: {
  workbench: TournamentDetailWorkbenchState;
  expandedClubIds: string[];
  lineupSubmissionByClubId: Record<string, LineupSubmission>;
  lineupPlayersById: Record<string, PlayerProfile>;
  loadingLineupPlayerIds: string[];
  onToggleClubRoster: (club: ClubSummary) => void;
}) {
  if (workbench.invitedClubs.length === 0) {
    return <EmptyState asListItem={false}>{participantText.noClubs}</EmptyState>;
  }

  return (
    <div className="grid max-h-[52vh] gap-3 overflow-y-auto pr-1">
      {workbench.invitedClubs.map((club) => (
        <ClubParticipantRow
          key={club.id}
          club={club}
          clubExpanded={expandedClubIds.includes(club.id)}
          lineupCount={workbench.lineupSubmissionCounts[club.id] ?? 0}
          submission={lineupSubmissionByClubId[club.id]}
          lineupPlayersById={lineupPlayersById}
          loadingLineupPlayerIds={loadingLineupPlayerIds}
          onToggle={() => onToggleClubRoster(club)}
        />
      ))}
    </div>
  );
}
