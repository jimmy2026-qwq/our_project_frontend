import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/ui';
import { cx } from '@/components/ui/cx';
import type { ClubSummary } from '@/pages/objects/club';

import { detailShellClassNames } from './tournament-detail.styles';
import { InviteParticipantDialog } from './tournament-detail.participants.dialogs';
import { ClubParticipantList } from './tournament-detail.participants.panel';
import { participantText } from './tournament-detail.participants.text';
import {
  ParticipantSection,
  PlayerRow,
} from './tournament-detail.participants.shared';
import {
  type LineupSubmission,
  useLineupPlayers,
} from '../hooks/tournament-detail.participants-lineup';
import type { TournamentDetailWorkbenchState } from '../objects/tournament-detail.types';

export function TournamentDetailParticipantsTab({
  workbench,
  onInviteClub,
  onInvitePlayer,
  onSelectClubId,
  onSelectPlayerId,
}: {
  workbench: TournamentDetailWorkbenchState;
  onInviteClub: () => Promise<void> | void;
  onInvitePlayer: () => Promise<void> | void;
  onSelectClubId: (clubId: string) => void;
  onSelectPlayerId: (playerId: string) => void;
}) {
  const [clubsExpanded, setClubsExpanded] = useState(false);
  const [playersExpanded, setPlayersExpanded] = useState(false);
  const [clubInviteOpen, setClubInviteOpen] = useState(false);
  const [playerInviteOpen, setPlayerInviteOpen] = useState(false);
  const [expandedClubIds, setExpandedClubIds] = useState<string[]>([]);

  const nextStage = useMemo(
    () =>
      workbench.profile.stages?.find(
        (stage) => stage.stageId === workbench.profile.nextStageId,
      ) ?? workbench.profile.stages?.[0],
    [workbench.profile.nextStageId, workbench.profile.stages],
  );
  const lineupSubmissionByClubId = useMemo(
    () =>
      Object.fromEntries(
        (nextStage?.lineupSubmissions ?? []).map((submission) => [
          submission.clubId,
          submission,
        ]),
      ) as Record<string, LineupSubmission>,
    [nextStage?.lineupSubmissions],
  );
  const { lineupPlayersById, loadingLineupPlayerIds } = useLineupPlayers({
    expandedClubIds,
    lineupSubmissionByClubId,
  });
  const clubOptions = workbench.selectableClubs.map((club) => ({
    id: club.id,
    label: club.name,
  }));
  const playerOptions = workbench.selectablePlayers.map((player) => ({
    id: player.playerId,
    label: `${player.displayName} / ${participantText.elo} ${player.elo ?? 0}`,
  }));

  function toggleClubRoster(club: ClubSummary) {
    setExpandedClubIds((current) =>
      current.includes(club.id)
        ? current.filter((clubId) => clubId !== club.id)
        : [...current, club.id],
    );
  }

  return (
    <>
      <div
        className={cx(
          detailShellClassNames.panel,
          detailShellClassNames.panelFull,
        )}
      >
        <section className="grid h-full min-h-0 content-start gap-[14px] overflow-x-hidden overflow-y-auto pr-2 [scrollbar-gutter:stable]">
          <div className="grid auto-rows-min content-start items-start gap-4 p-4">
            <h2 className="m-0 text-[1.25rem] font-semibold text-[#f2f7fb]">
              {participantText.participants}
            </h2>
            <div className="grid content-start items-start gap-4">
              <ParticipantSection
                title={participantText.clubSection}
                count={workbench.invitedClubs.length}
                countUnit={participantText.clubs}
                expanded={clubsExpanded}
                toggleLabel={
                  clubsExpanded
                    ? participantText.collapseClubs
                    : participantText.expandClubs
                }
                canManageTournament={workbench.canManageTournament}
                actionLabel={participantText.inviteClub}
                actionDisabled={
                  workbench.isSubmittingTournamentAction ||
                  workbench.selectableClubs.length === 0
                }
                onAction={() => setClubInviteOpen(true)}
                onToggle={() => setClubsExpanded((current) => !current)}
              >
                <ClubParticipantList
                  workbench={workbench}
                  expandedClubIds={expandedClubIds}
                  lineupSubmissionByClubId={lineupSubmissionByClubId}
                  lineupPlayersById={lineupPlayersById}
                  loadingLineupPlayerIds={loadingLineupPlayerIds}
                  onToggleClubRoster={toggleClubRoster}
                />
              </ParticipantSection>

              <ParticipantSection
                title={participantText.playerSection}
                count={workbench.participantPlayers.length}
                countUnit={participantText.people}
                expanded={playersExpanded}
                toggleLabel={
                  playersExpanded
                    ? participantText.collapsePlayers
                    : participantText.expandPlayers
                }
                canManageTournament={workbench.canManageTournament}
                actionLabel={participantText.invitePlayer}
                actionDisabled={
                  workbench.isSubmittingTournamentAction ||
                  workbench.selectablePlayers.length === 0
                }
                onAction={() => setPlayerInviteOpen(true)}
                onToggle={() => setPlayersExpanded((current) => !current)}
              >
                {workbench.participantPlayers.length > 0 ? (
                  <div className="grid max-h-[52vh] gap-3 overflow-y-auto pr-1">
                    {workbench.participantPlayers.map((player) => (
                      <PlayerRow key={player.playerId} player={player} />
                    ))}
                  </div>
                ) : (
                  <EmptyState asListItem={false}>
                    {participantText.noPlayers}
                  </EmptyState>
                )}
              </ParticipantSection>
            </div>
          </div>
        </section>
      </div>

      <InviteParticipantDialog
        open={clubInviteOpen}
        title={participantText.inviteClubTitle}
        description={participantText.inviteClubDescription}
        label={participantText.chooseClub}
        value={workbench.selectedClubId}
        options={clubOptions}
        isSubmitting={workbench.isSubmittingTournamentAction}
        emptyLabel={participantText.noClubOptions}
        onValueChange={onSelectClubId}
        onSubmit={async () => {
          await onInviteClub();
          setClubInviteOpen(false);
        }}
        onOpenChange={setClubInviteOpen}
      />

      <InviteParticipantDialog
        open={playerInviteOpen}
        title={participantText.invitePlayerTitle}
        description={participantText.invitePlayerDescription}
        label={participantText.choosePlayer}
        value={workbench.selectedPlayerId}
        options={playerOptions}
        isSubmitting={workbench.isSubmittingTournamentAction}
        emptyLabel={participantText.noPlayerOptions}
        onValueChange={onSelectPlayerId}
        onSubmit={async () => {
          await onInvitePlayer();
          setPlayerInviteOpen(false);
        }}
        onOpenChange={setPlayerInviteOpen}
      />
    </>
  );
}
